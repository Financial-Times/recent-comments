'use strict';

const config = {
	livefyre: {
		network: {
			name: process.env['LIVEFYRE_NETWORK_NAME'],
			key: process.env['LIVEFYRE_NETWORK_KEY']
		}
	},
	db: {
		dev: {
			url: process.env['DATABASE_URL']
		},
		test: {
			url: 'postgres://postgres@localhost:5432/recent_comments_test'
		},
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
