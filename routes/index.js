'use strict';
const models = require('../models');
const express = require('express');
const router = express.Router();

router.get('/v1/recent-comments', (req, res) => {
	let siteId = req.query.siteid;
	let tag = req.query.tagname;
	if ( !siteId || !tag ) {
		return res.send('Both siteid and tagname params must be set.');
	}
	let count = 25;
	if (req.query.hasOwnProperty('count')) {
		let intCount = parseInt(req.query.count, 10);
		count = (intCount < 101) ? intCount : 100;
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
                	articles.site_id = :siteId
                	AND tags.name = :tagName
                ORDER BY comments.created_at DESC
                LIMIT :count
	`;
	models.sequelize.query(sqlQuery,
		{ replacements: {
			siteId: siteId,
			tagName: tag,
			count: count
		}, type: models.sequelize.QueryTypes.SELECT
		}).then(comments => {
			res.json(comments);
		});
});

module.exports = router;
