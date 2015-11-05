
'use strict';

module.exports = (sequelize, DataTypes) => {
	let ArticleTag = sequelize.define('articleTag', {}, {
		timestamps: false,
		underscoredAll: true
	});
	return ArticleTag;
};
