'use strict';

const lfActivityStream = require('lf-activity-stream');
const _ = require('lodash');
const config = require('../env');

const lfClient = new lfActivityStream(config.livefyre.network.name, config.livefyre.network.key);
const healthCheckModel = {
	name: 'LiveFyre Activity stream client',
	id: 'livefyre-stream',
	ok: false,
	technicalSummary: 'Client used to handle LiveFyre Activity Stream',
	severity: 2,
	businessImpact: 'No comments will be handled',
	checkOutput: '',
	panicGuide: 'Check the logs for worker',
	lastUpdated: new Date().toISOString()
};

module.exports = () => {
	return new Promise(resolve => {
		lfClient.makeRequest(0, error => {
			healthCheckModel.lastUpdated = new Date().toISOString();
			if(error) {
				healthCheckModel.ok = false;
				healthCheckModel.checkOutput = error;
				resolve(healthCheckModel);
			} else {
				healthCheckModel.ok = true;
				resolve(_.omit(healthCheckModel, ['checkOutput']));
			}
		}, true); //don't forget to pass the last param (once = true)
	});
};
