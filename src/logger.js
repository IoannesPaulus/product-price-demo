const bunyan = require('bunyan');
const config = require('./config');

// create logger
const logger = bunyan.createLogger({
  name: config.get('name'),
  level: config.get('logLevel'),
});

module.exports = logger;
