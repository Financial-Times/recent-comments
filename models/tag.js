'use strict';

module.exports = (sequelize, DataTypes) => {
	let Tag = sequelize.define('tag', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			unique: true
		}
	}, {
		timestamps: false,
		classMethods: {
			associate: models => {
				Tag.belongsToMany(models.article, {through: 'articleTag', foreignKey: 'tag_id'});
			}

		}
	});
	return Tag;
};
