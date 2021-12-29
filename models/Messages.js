'use strict';
module.exports = (sequelize, DataTypes) => {
        const messages = sequelize.define('Messages', {
                id: {
                        type: DataTypes.INTEGER(10),
                        primaryKey: true,
                        autoIncrement: true,
                        field: 'id'
                },
                message: {
                        type: DataTypes.TEXT,
                        allowNull: false,
                        field: 'message'
                },
                messageType: {
                        type: DataTypes.ENUM,
                        allowNull: false,
                        values: ['text', 'media'],
                        field: 'messageType'
                },
                receiverId: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        field: 'receiverId',
                },
                createdBy: {
                        type: DataTypes.INTEGER(10),
                        allowNull: false,
                        field: 'createdBy'
                },
                updatedBy: {
                        type: DataTypes.INTEGER(10),
                        allowNull: true,
                        field: 'updatedBy'
                },
                deletedBy: {
                        type: DataTypes.INTEGER(10),
                        allowNull: true,
                        field: 'deletedBy'
                },
                deletedAt: {
                        type: DataTypes.DATE,
                        allowNull: true,
                        field: 'deletedAt'
                }
        }, {});

        messages.associate = function (models) {
                messages.belongsTo(models.Users);
        };
        return messages;
};