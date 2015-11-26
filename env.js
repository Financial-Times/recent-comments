'use strict';

const config = {
	livefyre: {
		network: {
			name: process.env['LIVEFYRE_NETWORK_NAME'],
			key: process.env['LIVEFYRE_NETWORK_KEY']
		}
	},
	db: {
		url: process.env['DATABASE_URL'],
		ssl: (process.env['DATABASE_SSL'] == 'true')
	},
	suds: {
		url: process.env['SUDS_URL']
	},
	ironmq: {
		token: process.env['IRON_MQ_TOKEN'],
		projectId: process.env['IRON_MQ_PROJECT_ID']
	}
};

module.exports = config;
