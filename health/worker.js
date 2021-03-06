'use strict';

const _ = require('lodash');
const config = require('../env');
const iron_mq = require('iron_mq');

const imq = new iron_mq.Client({
	token: config.ironmq.token,
	project_id: config.ironmq.projectId
});
const queue = imq.queue('health');

const healthCheckModel = {
	name: 'Worker listening to LiveFyre Activity Stream',
	id: 'recent-comments-worker',
	ok: false,
	technicalSummary: 'Handles the LiveFyre Activity Stream',
	severity: 2,
	businessImpact: 'No comments will be handled',
	checkOutput: '',
	panicGuide: 'Check worker logs',
	lastUpdated: new Date().toISOString()
};
let lastStatus = null;
let lastUpdated = null;

function checkHealth(cb) {
	queue.reserve({n: 1}, (error, body) => {
		if(error) {
			return cb(error);
		}
		return cb(null, body);
	});
}

module.exports = () => {
	return new Promise(resolve => {
		checkHealth((error, body) => {
			if (error) {
				healthCheckModel.ok = false;
				healthCheckModel.checkOutput = error;
			}
			if (typeof body == 'undefined') {
				if ( lastStatus !== null && lastUpdated ) {
					healthCheckModel.ok = lastStatus;
					healthCheckModel.lastUpdated = lastUpdated;
				} else {
					healthCheckModel.ok = 'unknown';
					healthCheckModel.checkOutput = 'Unknown state, no messages in the queue.';
				}
			} else {
				try {
					let message = JSON.parse(body.body);
					if (message.status === false) {
						healthCheckModel.checkOutput = `[Error] ${message.error}`;
					}
					healthCheckModel.ok = message.status;
					healthCheckModel.lastUpdated = new Date(message.insertedAt).toISOString();
					lastStatus = message.status;
					lastUpdated = new Date(message.insertedAt).toISOString();
				} catch(e) {
					healthCheckModel.ok = false;
					healthCheckModel.checkOutput = e;
				}
			}
			if (healthCheckModel.ok === true) {
				resolve(_.omit(healthCheckModel, ['checkOutput']));
			} else {
				resolve(healthCheckModel);
			}
		});
	});
};

