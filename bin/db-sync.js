'use strict';
const models = require('../models');

/*eslint no-console: 0*/
models.article.sync({force: true})
	.then(() => {
		console.log('articles table synced');
		return models.comment.sync({force: true});
	})
	.then(() => {
		console.log('comments table synced');
		return models.tag.sync({force: true});
	})
	.then(() => {
		console.log('tags table synced');
		return models.articleTag.sync({force: true});
	})
    .then(() => {
		return console.log('article_tags table synced');
    });
