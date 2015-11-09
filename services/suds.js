'use strict';
const request = require('request');
const config = require('../env');

module.exports = (articleId, url) => {
	return new Promise((resolve, reject) => {
		request({
			url: config.suds.url,
			qs: {articleId, url}
		}, (error, response, body) => {
			if (error || response.statusCode != 200) {
				return reject({body: error || body, response});
			}
			return resolve({ response, body });
		});
	});
};

