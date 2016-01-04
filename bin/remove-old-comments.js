#!/usr/bin/env node

'use strict';
const models = require('../models');
const log = require('../services/logger');

const OLDER_THAN = '30 days';

models.comment.destroy({
	where: {
		createdAt: {
			lt: models.Sequelize.literal(`now() - '${OLDER_THAN}'::interval`)
		}
	}
}).then(affectedRows => log.info({service: 'clean-old-comments'}, `${affectedRows} comments deleted`))
	.catch(error => log.error({service: 'clean-old-comments'}, error.message));
