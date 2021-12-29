'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};
const config = require('../config');
var sequelize = new Sequelize(config.CHAT_DB_SCHEMA, config.CHAT_DB_USERNAME, config.CHAT_DB_PASSWORD, {
        host: config.CHAT_DB_HOST,
        port: config.CHAT_DB_PORT,
        dialect: 'postgres',
        logging: true,
        pool: {
                max: 100,
                min: 0,
                idle: 20000,
                acquire: 30000
        },
        operatorsAliases: 0,
        dialectOptions: {
                useUTC: false //for reading from database
        },
        timezone: '+06:15' //for writing to database
});
fs.readdirSync(__dirname).filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
                db[modelName].associate(db);
        }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;