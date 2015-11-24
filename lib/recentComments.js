'use strict';
const models = require('../models');
const suds = require('../services/suds');
const cheerio = require('cheerio');

const Article = models.article;
const Comment = models.comment;
const Tag = models.tag;

function handleTags(tags) {
	return Promise.all(tags.map(tag => {
		return Tag.findCreateFind({where: {name: tag}, defaults: {name:tag}});
	}));
}

function handleArticle(article) {
	return Article.findCreateFind({where: {id: article.id}, defaults: article});
}

function handleComment(comment) {
	return Comment.findCreateFind({where: {commentId: comment.commentId}, defaults: comment});
}

function getCommentData(comment, eventId) {
	return {
		commentId: parseInt(comment.commentId, 10),
		eventId: eventId,
		bodyHtml: cheerio.load(comment.content)('p').children().remove().end().text().trim(),
		displayName: comment.author.displayName,
		visibility: comment.visibility,
		createdAt: new Date(comment.createdAt * 1000),
		updatedAt: new Date(comment.updatedAt * 1000)
	};
}

function getArticleData(article) {
	return {
		id: article.articleId,
		siteId: article.siteId,
		title: article.title,
		url: article.url
	};
}

function getComments(options) {
	let sqlQuery = `
                SELECT
					comments.comment_id AS "commentId",
                    comments.body_html AS "bodyHtml",
                    EXTRACT(EPOCH FROM comments.created_at AT TIME ZONE 'utc') * 1000 AS "createdAt",
                    comments.display_name AS "displayName",
                    articles.id AS "articleId",
                    articles.url AS "url",
                    articles.title AS "title"
                FROM comments
                LEFT JOIN articles
                    ON articles.id = comments.article_id
                LEFT JOIN article_tags
                    ON article_tags.article_id = articles.id
                LEFT JOIN tags
                    ON tags.id = article_tags.tag_id
                WHERE
                	comments.visibility = :vis
                	AND articles.site_id = :siteId
                	AND tags.name = :tagName
                ORDER BY comments.created_at DESC
                LIMIT :count
	`;
	return models.sequelize.query(sqlQuery,
		{ replacements: {
			siteId: options.siteId,
			tagName: options.tag,
			vis: 1,
			count: options.count
		}, type: models.sequelize.QueryTypes.SELECT
		});
}

function handleActivityEventItem(item, lastCalledEventId) {
	if(item.article.url.indexOf('/liveblogs/') === -1 && item.article.url.indexOf('/marketslive/') === -1) {
		let article = getArticleData(item.article);
		let comment = getCommentData(item.comment, lastCalledEventId);
		return suds(item.article.articleId, item.article.url)
			.then(res => {
				return Promise.all([handleTags(res), handleArticle(article), handleComment(comment)]);
			}).then(results => {
				let tagInstances = results[0].map(tagInstance => tagInstance[0]);
				let articleInstance = results[1][0];
				let isNewArticle = results[1][1];
				let commentInstance = results[2][0];
				comment.articleId = articleInstance.id;
				let actions = [commentInstance.set(comment).save()];
				if(isNewArticle) {
					actions.push(
						commentInstance.setArticle(articleInstance),
						articleInstance.setTags(tagInstances)
					);
				}
				return Promise.all(actions);
			});
	}
}

module.exports = {
	handleActivityEventItem,
	getComments
};


