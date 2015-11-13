'use strict';

const pg = require('pg');
const _ = require('lodash');
const config = require('../env');
const dbUrl = `${config.db.url}?ssl=${config.db.ssl}`;

let healthCheckModel = {
	name: 'Postgresql DB connection',
	ok: true,
	technicalSummary: 'Postgresql DB is used to store the comments from livefyre activity stream',
	severity: 1,
	businessImpact: 'Recent comments is down',
	checkOutput: '',
	panicGuide: '',
	lastUpdated: new Date().toISOString()
};

module.exports = () => {
	return new Promise((resolve) => {
		let client = new pg.Client(dbUrl);
		client.connect(error => {
			healthCheckModel.lastUpdated = new Date().toISOString();
			if (error) {
				healthCheckModel.ok = false;
				healthCheckModel.checkOutput = 'Connection to postgres is down. Please check the server';
			} else {
				healthCheckModel.ok = true;
				healthCheckModel.checkOutput = 'Connection to postgres is functional';
			}
			resolve(_.pick(healthCheckModel, ['name', 'ok', 'lastUpdated']));
			client.end();
		});
	});
};
