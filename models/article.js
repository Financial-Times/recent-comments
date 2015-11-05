'use strict';

module.exports = (sequelize, DataTypes) => {
	let Article = sequelize.define('article', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		siteId: {
			type: DataTypes.INTEGER,
			field: 'site_id'
		},
		title: {
			type: DataTypes.TEXT
		},
		url: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: false,
		classMethods: {
			associate: models => {
				Article.hasMany(models.comment);
				Article.belongsToMany(models.tag, {through: 'articleTag', foreignKey: 'article_id'});
			}
		}
	});
	return Article;
};
