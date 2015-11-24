'use strict';

const expect = require('chai').expect;
const config = require('../env');
const lfActivityStream = require('lf-activity-stream');

let lfClient = null;
let lfCollection = null;
let lastEventId = null;


describe('LiveFyre Activity Stream Client', () => {
	before(() => {
		lfClient = new lfActivityStream(config.livefyre.network.name, config.livefyre.network.key);
	});
	it('should be an object', () => {
		expect(lfClient).to.be.an('object');
	});
	it('should have a networkUrn property', () => {
		expect(lfClient).to.include.keys('networkUrn');
	});
	it('should have a makeRequest method', () => {
		expect(lfClient.makeRequest).to.be.a('function');
	});
	describe('#makeRequest method', () => {
		it('should return a collection', (done) => {
			lfClient.makeRequest(0, (error, data, lastCalledEventId) => {
				lfCollection = data;
				lastEventId = lastCalledEventId;
				expect(error).to.be.null;
				expect(data).to.be.an('array');
				done();
			}, true);
		});
		it('each item in the collection should be an object', () => {
			expect(lfCollection).not.to.be.null;
		});
		it('each item in the collection should have the required keys', (done) => {
			if (lfCollection.length > 0) {
				let item = lfCollection[Math.floor(Math.random() * lfCollection.length)];
				expect(item).to.have.all.keys(['collectionId', 'article', 'comment']);
				expect(item.article).to.be.an('object');
				expect(item.comment).to.be.an('object');
				done();
			} else {
				expect(lfCollection).to.be.empty;
				done(Error('collection is empty'));
			}
		});
		it('should return the last called eventId', () => {
			expect(lastEventId).not.to.be.null;
			expect(lastEventId).to.be.a('number');
		});
	});
});


