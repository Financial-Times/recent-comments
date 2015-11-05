'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.json')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
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
