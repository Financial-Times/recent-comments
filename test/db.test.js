'use strict';

const recentComments = require('../lib/recentComments');
const eventActivityItem = require('./lfCollectionMock')[1];
const pg = require('pg');
const config = require('../env');
const dbUrl = `${config.db.url}?ssl=${config.db.ssl}`;
const expect = require('chai').expect;

let client = new pg.Client(dbUrl);
const testEventId = -1;

describe('Postgres database', () => {
	it('connection should exist', (done) => {
		client.connect(err => {
			expect(err).to.be.null;
			done();
		});
	});
	describe('#Create', () => {
		it('Activity Stream Item should be handled', (done) => {
			recentComments.handleActivityEventItem(eventActivityItem, testEventId).then(() => {
				done();
			});
		});
		it('Comment should be in the database', (done) => {
			return client.query(`SELECT * FROM comments WHERE event_id='${testEventId}'`, (err, result) => {
				expect(err).to.be.null;
				expect(result).not.to.be.null;
				expect(result.rows).to.have.length(1);
				done();
			});
		});
		it('Article should be in the database', (done) => {
			return client.query(`SELECT * FROM articles WHERE id='${eventActivityItem.article.articleId}'`, (err, result) => {
				expect(err).to.be.null;
				expect(result).not.to.be.null;
				expect(result.rows).to.have.length(1);
				done();
			});
		});
	});
	describe('#Delete', () => {
		it('Article should be deleted', (done) => {
			return client.query(`DELETE FROM articles WHERE id='${eventActivityItem.article.articleId}'`, (err, result) => {
				expect(err).to.be.null;
				expect(result.rowCount).to.equal(1);
				done();
			});
		});
		it('Comments should be deleted', (done) => {
			return client.query(`SELECT * FROM comments WHERE comment_id='${eventActivityItem.comment.commentId}'`, (err, result) => {
				expect(err).to.be.null;
				expect(result.rowCount).to.equal(0);
				done();
			});
		});
		it('Article tags should be deleted', (done) => {
			return client.query(`SELECT * FROM article_tags WHERE article_id='${eventActivityItem.article.articleId}'`, (err, result) => {
				expect(err).to.be.null;
				expect(result.rowCount).to.equal(0);
				done();
			});
		});
	});
});
