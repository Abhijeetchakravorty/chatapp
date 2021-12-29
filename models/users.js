'use strict';
module.exports = (sequelize, DataTypes) => {
        const users = sequelize.define('Users', {
                id: {
                        type: DataTypes.INTEGER(10),
                        primaryKey: true,
                        autoIncrement: true,
                        field: 'id'
                },
                phone: {
                        type: DataTypes.STRING(10),
                        allowNull: true,
                        unique:  true,
                        field: 'phone'
                },
                email: {
                        type: DataTypes.STRING(100),
                        allowNull: false,
                        unique: true,
                        field: 'email',
                },
                password: {
                        type: DataTypes.STRING(100),
                        allowNull: false,
                        field: 'password'
                },
                firstName: {
                        type: DataTypes.STRING(100),
                        allowNull: false,
                        field: 'firstName'
                },
                lastName: {
                        type: DataTypes.STRING(100),
                        allowNull: false,
                        field: 'lastName'
                },
                gender: {
                        type: DataTypes.INTEGER(3),
                        allowNull: true,
                        field: 'gender',
                        defaultValue: 4
                },
                birthdate: {
                        type: DataTypes.DATE,
                        allowNull: true,
                        field: 'birthdate',
                        defaultValue: null
                },
                createdBy: {
                        type: DataTypes.INTEGER(10),
                        allowNull: true,
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

        users.associate = function (models) {
                users.hasMany(models.Messages);
        };
        return users;
};