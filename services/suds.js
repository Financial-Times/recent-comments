'use strict';
const request = require('request');

const sudsUrl = [
	'http://',
	'session-user-data-service-test.herokuapp.com/v1/livefyre/metadata'
].join('');

module.exports = (articleId, url) => {
	return new Promise((resolve, reject) => {
		request({
			url: sudsUrl,
			qs: {articleId, url}
		}, (error, response, body) => {
			if (error || response.statusCode != 200) {
				return reject({body: error || body, response});
			}
			return resolve({ response, body });
		});
	});
};

