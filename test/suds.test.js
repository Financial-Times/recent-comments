'use strict';

const chai = require('chai');
const suds = require('../services/suds');
const chaiAsPromised = require('chai-as-promised');
const itemMock = require('./lfCollectionMock')[0];
const should = chai.should();

chai.use(chaiAsPromised);

const testData = {
	id: itemMock.article.articleId,
	url: itemMock.article.url
};
let sudsResponse = null;

describe('SUDS API', () => {
	before(() => {
		sudsResponse = suds(testData.id, testData.url);
	});
	it('should resolve with a response', () => {
		return sudsResponse.should.be.fulfilled;
	});
	describe('Response', () => {
		it('should be a collection', () => {
			return sudsResponse.should.eventually.be.an('array');
		});
		it('should not be empty', () => {
			return sudsResponse.should.eventually.not.be.empty;
		});
		it('should have the expected elements', () => {
			return sudsResponse.should.eventually.contain('sections.UK');
		});
	});
});
