'use strict';

const models = require('../models');
const log = require('../services/logger');

const OLDER_THAN = '30 days';

const cleanupQuery = `DELETE FROM comments WHERE created_at < NOW() - INTERVAL '${OLDER_THAN}'`;

models.sequelize.query(cleanupQuery, {
	type: models.sequelize.QueryTypes.DELETE
}).then(() => {
	log.info({service: 'clean-old-comments'}, 'old comments deleted');
}).catch((error) => {
	log.error({service: 'clean-old-comments'}, error.message);
});
