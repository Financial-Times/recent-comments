'use strict';

const config = require('../env');
const request = require('request');
const url = require('url');

module.exports = () => {
	return new Promise(resolve => {
		let sudsUrl = url.parse(config.suds.url);
		resolve('suds ok');
	});
};
