const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const config = require('../config');

const mongoConfig = config.get('database');
const mongoAuth = mongoConfig.username ? `${mongoConfig.username}:${mongoConfig.password}@` : '';
const url = `mongodb://${mongoAuth}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbname}`;
const db = mongoose.createConnection(url);

module.exports = db;
