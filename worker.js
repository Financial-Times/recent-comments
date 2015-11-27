'use strict';

const lfActivityStream = require('lf-activity-stream');
const models = require('./models');
const config = require('./env');
const recentComments = require('./lib/recentComments');
const iron_mq = require('iron_mq');

const lfClient = new lfActivityStream(config.livefyre.network.name, config.livefyre.network.key);
const imq = new iron_mq.Client({
	token: config.ironmq.token,
	project_id: config.ironmq.projectId,
	queue_name: 'health'
});

const queue = imq.queue('health');
let lastEventId = 0;

/*eslint-disable no-console */
function pushMessageToQueue(msgObject, callback) {
	queue.clear(() => {
		msgObject.insertedAt = Date.now();
		queue.post(JSON.stringify(msgObject), error => {
			if (error) {
				console.log('Cannot post to IronMq Service!', error);
			}
			if(typeof callback == 'function') {
				callback();
			}
		});
	});
}

function processActivity(collection, lastId) {
	return Promise.all(collection.map(item => {
		return recentComments.handleActivityEventItem(item, lastId);
	}));
}

function handleActivityEvent(error, data, lastCalledEventId) {
	if (error || !(data instanceof Array) || data.length == 0) {
		pushMessageToQueue({
			status: false,
			error: error
		});
	} else {
		processActivity(data, lastCalledEventId).then(() => {
			pushMessageToQueue({
				status: true
			});
		}).catch((error) => {
			pushMessageToQueue({
				status: false,
				error: error
			});
			console.log(error);
		});
	}
}
/*eslint-enable no-console*/

function init() {
	models.sequelize.query(`SELECT event_id FROM comments ORDER BY updated_at DESC LIMIT 1`, {
		type: models.sequelize.QueryTypes.SELECT
	}).then(event => {
		if (event.length) {
			lastEventId = event[0].event_id;
		}
		lfClient.makeRequest(lastEventId, handleActivityEvent);
	}).catch(() => {
		lfClient.makeRequest(lastEventId, handleActivityEvent);
	});
}

pushMessageToQueue({status: true}, init);
