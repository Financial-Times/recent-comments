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
		options: {
			logging: process.env['DB_LOGGING']
		}
	},
	suds: {
		url: 'session-user-data-service-test.herokuapp.com/v1/livefyre/metadata'
	}
};

module.exports = config;
