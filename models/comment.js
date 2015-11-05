'use strict';

module.exports = (sequelize, DataTypes) => {
	let Comment = sequelize.define('comment', {
		commentId: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			field: 'comment_id'
		},
		eventId: {
			type: DataTypes.BIGINT,
			field: 'event_id'
		},
		articleId: {
			type: DataTypes.STRING,
			field: 'article_id'
		},
		bodyHtml: {
			type: DataTypes.TEXT,
			field: 'body_html'
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'updated_at'
		}
	}, {
		timestamps: false,
		classMethods: {
			associate: models => {
				Comment.belongsTo(models.article);
			}
		}
	});
	Comment.removeAttribute('id');
	return Comment;
};
