'use strict';

const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

router.get('/v1/recent-comments', controllers.recentComments);
router.get('/__about', controllers.about);
router.get('/__health', controllers.health);

module.exports = router;
