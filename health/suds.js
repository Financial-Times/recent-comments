'use strict';

const _ = require('lodash');
const suds = require('../services/suds');
const test = {
	articleId: '07db6f6f-5bc5-3511-a314-01a42d61f6a2',
	url: 'http://test.blogs.ft.com/the-world/2015/11/behat-test-title-free-post-allow-comments-5/'
};
const healthCheckModel = {
	name: 'SUDS API',
	id: 'suds-api',
	ok: false,
	technicalSummary: 'Reads tags for articles',
	severity: 2,
	businessImpact: `No content will be inserted to the DB`,
	checkOutput: '',
	panicGuide: '',
	lastUpdated: new Date().toISOString()
};

module.exports = () => {
	return new Promise(resolve => {
		suds(test.articleId, test.url).then(() => {
			healthCheckModel.ok = true;
			healthCheckModel.lastUpdated = new Date().toISOString();
			resolve(_.pick(healthCheckModel, ['name', 'id', 'ok', 'lastUpdated']));
		}).catch(error => {
			healthCheckModel.ok = false;
			healthCheckModel.lastUpdated = new Date().toISOString();
			healthCheckModel.checkOutput = error;
			resolve(healthCheckModel);
		});
	});
};
