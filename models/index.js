'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../env');
const sequelize = new Sequelize(config.db.url, {
	logging: false,
	pool: {
		max: 20,
		min: 0,
		idle: 5
	},
	dialectOptions: {
		ssl: config.db.ssl
	}
});
const db = {};

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach(file => {
		let model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].hasOwnProperty('associate')) {
		db[modelName].associate(db);
	}
});

/** the instance **/
db.sequelize = sequelize;
/** the constructor **/
db.Sequelize = Sequelize;

module.exports = db;
