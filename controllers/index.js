'use strict';
const models = require('../models');
const health = require('../health');
const healthModel = {
	schemaVersion: 1,
	name: 'recent-comments',
	description: 'recent-comments-test',
	checks: []
};

exports.recentComments = (req, res) => {
	let siteId = req.query.siteid;
	let tag = req.query.tagname;
	if ( !siteId || !tag ) {
		return res.send('Both siteid and tagname params must be set.');
	}
	let count = 10;
	if (req.query.hasOwnProperty('count') && req.query.count) {
		let intCount = parseInt(req.query.count, 10);
		if (!isNaN(intCount) && intCount > 0) {
			count = (intCount < 101) ? intCount : 100;
		}
	}
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
	models.sequelize.query(sqlQuery,
		{ replacements: {
			siteId: siteId,
			tagName: tag,
			vis: 1,
			count: count
		}, type: models.sequelize.QueryTypes.SELECT
		}).then(comments => {
			res.json(comments);
		});
};

exports.about = (req, res) => {
	res.json({
		name: 'recent-comments',
		versions: [
			`${req.headers.host}/v1`
		]
	});
};

exports.health = (req, res) => {
	health.check().then(result => {
		healthModel.checks = result;
		res.json(healthModel);
	}).catch(error => {
		res.json(error);
	});
};
