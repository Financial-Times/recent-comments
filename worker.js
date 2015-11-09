'use strict';
const lfActivityStream = require('lf-activity-stream');
const models = require('./models');
const config = require('./env');
const suds = require('./services/suds');

const lfClient = new lfActivityStream(config.livefyre.network.name, config.livefyre.network.key);

const Article = models.article;
const Comment = models.comment;
const Tag = models.tag;

let lastEventId = 0;



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

function findTags(tags) {
	return Tag.findAll({where: {
		name: {
			$in: tags
		}
	}});
}
function getCommentData(comment, eventId) {
	return {
		commentId: parseInt(comment.commentId, 10),
		eventId: eventId,
		bodyHtml: comment.content,
		displayName: comment.author.displayName,
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


/*eslint-disable no-console */
function handleActivityEvent(error, data, lastEventId) {
	if (error || !data) {
		setTimeout(() => {
			lfClient.makeRequest(0, handleActivityEvent);
		}, 5000);
		return;
	}
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
					handleComment(comment).spread((commentInstance, created)=> {
						if(!created) {
							return commentInstance.set(comment);
						}
						console.log(`Comment with id ${comment.commentId} handled`);
					}).catch(error => {
						console.log(error);
					});
					articleInstance.setTags(tagInstances).catch(error => {
						console.log(error);
					});
				});
			}).catch(err => {
				console.log(err);
			});
	});
}
/*eslint-enable no-console*/

models.sequelize.query(`SELECT event_id FROM comments ORDER BY updated_at DESC LIMIT 1`, {
	type: models.sequelize.QueryTypes.SELECT
}).then(event => {
	if (event.length) {
		lastEventId = event[0].event_id;
	}
	lfClient.makeRequest(lastEventId, handleActivityEvent);
}).catch(() => {
	lfClient.makeRequest(lastEventId, handleActivityEvent);
});