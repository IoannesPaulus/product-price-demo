const convict = require('convict');

const conf = convict({
  name: {
    doc: 'The application name.',
    format: '*',
    default: 'Product demo',
    env: 'APP_NAME',
    arg: 'name'
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env'
  },
  logLevel: {
    doc: 'Logging level.',
    format: ['info', 'warn', 'error'],
    default: 'info',
    env: 'LOG_LEVEL',
    arg: 'logLevel'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  database: {
    host: {
      format: String,
      default: 'localhost',
      env: 'MONGO_HOSTNAME'
    },
    dbname: {
      format: String,
      default: 'product_demo',
      env: 'MONGO_DB_NAME'
    },
    port: {
      format: 'port',
      default: 27017,
      env: 'MONGO_PORT'
    },
    username: {
      format: String,
      default: '',
      env: 'MONGO_USERNAME'
    },
    password: {
      format: String,
      default: '',
      env: 'MONGO_PASSWORD'
    }
  }
});

// Perform validation
conf.validate({ allowed: 'strict' });

module.exports = conf;
