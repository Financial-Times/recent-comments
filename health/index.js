'use strict';

const config = require('./config');

exports.check = () => {
	return Promise.all(
		config.checks.map(service => {
			return require(`./${service}`)();
		})
	);
};




