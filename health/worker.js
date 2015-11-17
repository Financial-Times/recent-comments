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
	ok: false,
	technicalSummary: 'Handles th LiveFyre Activity Stream',
	severity: 2,
	businessImpact: 'No comments will be handled',
	checkOutput: '',
	panicGuide: '',
	lastUpdated: new Date().toISOString()
};

function checkHealth(cb) {
	queue.reserve({n: 1, delete: true}, (error, body) => {
		if(error) {
			return cb(error);
		}
		setTimeout(() => {
			checkHealth(cb);
		}, 15000);
		return cb(null, body);
	});
}

checkHealth((error, body) => {
	if(error) {
		healthCheckModel.ok = false;
		healthCheckModel.checkOutput = error;
	}
	if(body) {
		let message = JSON.parse(body.body);
		if(message.status === false) {
			healthCheckModel.checkOutput = message.error;
		}
		healthCheckModel.ok = message.status;
		healthCheckModel.lastUpdated = new Date(body.available_at).toISOString();
	}
});

module.exports = () => {
	return new Promise(resolve => {
		if ( healthCheckModel.ok === true ) {
			resolve(_.pick(healthCheckModel, ['name', 'ok', 'lastUpdated']));
		} else {
			resolve(healthCheckModel);
		}
	});
};

