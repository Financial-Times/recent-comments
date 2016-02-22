'use strict';
const recentComments = require('../lib/recentComments');
const health = require('../health');
const healthModel = {
	schemaVersion: 1,
	name: 'recent-comments',
	systemCode: 'recent-comments',
	description: 'recent-comments',
	checks: []
};

exports.recentComments = (req, res) => {
	let siteId = req.query.siteid;
	let tag = req.query.tagname;
	if ( !siteId || !tag ) {
		return res.send('Both siteid and tagname params must be set.');
	}
	let count = 10;
	if (req.query.hasOwnProperty('count') && req.query.count) {
		let intCount = parseInt(req.query.count, 10);
		if (!isNaN(intCount) && intCount > 0) {
			count = (intCount < 101) ? intCount : 100;
		}
	}
	let options = {
		siteId,
		tag,
		count
	};
	recentComments.getComments(options).then(result => res.json(result));
};

exports.about = (req, res) => {
	res.json({
		name: 'recent-comments',
		versions: [
			`${req.headers.host}/v1`
		]
	});
};

exports.health = (req, res) => {
	health.check().then(result => {
		healthModel.checks = result;
		res.json(healthModel);
	}).catch(error => {
		res.json(error);
	});
};

exports.gtg = (req, res) => {
	health.check().then((result) => {
		let reducer = (status, service) => {
			if ( service.ok === false ) {
				status = false;
			}
			return status;
		};
		let statusCheck = result.reduce(reducer, true);
		statusCheck ? res.send('Ok') : res.status(503).send('Not ok');
	}).catch(() => {
		res.status(503).send('Not ok');
	});
};
