'use strict';

const pg = require('pg');
const _ = require('lodash');
const config = require('../env');
const dbUrl = `${config.db.url}?ssl=${config.db.ssl}`;

const healthCheckModel = {
	name: 'Postgresql DB connection',
	id: 'postgres',
	ok: false,
	technicalSummary: 'Postgresql DB is used to store the comments from livefyre activity stream',
	severity: 1,
	businessImpact: 'Recent comments is down',
	checkOutput: '',
	panicGuide: 'Check database connection',
	lastUpdated: new Date().toISOString()
};

module.exports = () => {
	return new Promise((resolve) => {
		let client = new pg.Client(dbUrl);
		client.connect(error => {
			healthCheckModel.lastUpdated = new Date().toISOString();
			healthCheckModel.ok = !error;
			if(error) {
				resolve(healthCheckModel);
			} else {
				resolve(_.omit(healthCheckModel, ['checkOutput']));
			}
			client.end();
		});
	});
};
