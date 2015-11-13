'use strict';

const lfActivityStream = require('lf-activity-stream');
const config = require('../env');

const lfClient = new lfActivityStream(config.livefyre.network.name, config.livefyre.network.key);

module.exports = () => {
	return new Promise(resolve => {
		resolve('lf ok');
	});
};
