'use strict';
const lfActivityStream = require('lf-activity-stream');
const models = require('./models');
const suds = require('./services/suds');

const lfClient = new lfActivityStream(process.env['lfNetwork'], process.env['lfNetworkSecret']);

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
	return Comment.upsert(comment, {validate: true});
}

function findTags(tags) {
	return Tag.findAll({where: {
		name: {
			$in: tags
		}
	}});
}
function getCommentData(comment, eventId) {
	return {
		commentId: comment.commentId,
		eventId: eventId,
		bodyHtml: comment.content,
		createdAt: new Date(comment.timestamp * 1000),
		updatedAt: new Date(comment.timestamp * 1000)
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


/*eslint-disable no-console */
function handleActivityEvent(error, data, lastEventId) {
	data.forEach(item => {
		let tags = null;
		let article = getArticleData(item.article);
		let comment = getCommentData(item.comment, lastEventId);
		suds(item.article.articleId, item.article.url)
			.then(res  => {
				tags = JSON.parse(res.body);
				return handleTags(tags);
			}).then(() => {
				return findTags(tags);
			}).then(tagInstances => {
				return handleArticle(article).spread(articleInstance => {
					comment.articleId = articleInstance.id;
					handleComment(comment).then(created => {
						console.log(created);
					}).catch(error => {
						console.log(error);
					});
					articleInstance.setTags(tagInstances).then(()=> {
						console.log('Tags associated successfully');
					}).catch(error => {
						console.log(error);
					});
				});
			}).catch(err => {
				console.log(err);
			});
	});
}
/*eslint-enable no-console*/


lfClient.makeRequest(1444921328781236, handleActivityEvent);
