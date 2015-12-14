'use strict';

const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

/**
 * @api {get} /v1/recent-comments recent-comments
 * @apiExample Example usage:
 * curl -i http://recent-comments-test.herokuapp.com/v1/recent-comments?siteid=377197&tagname=sections.UK&count=1
 * @apiVersion 1.2.2
 * @apiGroup v1
 * @apiDescription Get most recent comments for articles with tags specified by tagname param from the site with id of siteid ordered by createdAt field, descending.
 *
 * @apiParam {Number} siteid  ID of the site.
 * @apiParam {String} tagname Article tag name.
 * @apiParam {Number} [count] Number of comments to display (max=100).
 *
 * @apiSuccess {Object[]} result List of comments.
 * @apiSuccess {String} result.commentId Id of the comment.
 * @apiSuccess {String} result.bodyHtml Body of the comment.
 * @apiSuccess {Number} result.createdAt Timestamp in microseconds.
 * @apiSuccess {String} result.displayName Display name of the comment's author.
 * @apiSuccess {String} result.articleId Id of the article.
 * @apiSuccess {String} result.url Url of the article.
 * @apiSuccess {String} result.title Title of the article.
 *
 *
 * @apiSuccessExample Normal success
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "commentId":"420291017",
 *          "bodyHtml":"new test",
 *          "createdAt":1448618340000,
 *          "displayName":"ddragos-test",
 *          "articleId":"944938b4-8d0c-11e5-8be4-3506bf20cc2b",
 *          "url":"http://www.ft.com/cms/s/0/944938b4-8d0c-11e5-8be4-3506bf20cc2b.html",
 *          "title":"UK inflation below zero for second month - FT.com"
 *      }
 *  ]
 *
 * @apiSuccessExample No comments found for sent params
 *  HTTP/1.1 200 OK
 *  []
 *
 */
router.get('/v1/recent-comments', controllers.recentComments);
router.get('/__gtg', controllers.gtg);
router.get('/__about', controllers.about);
router.get('/__health', controllers.health);
router.get('/__health.json', controllers.health);

module.exports = router;
