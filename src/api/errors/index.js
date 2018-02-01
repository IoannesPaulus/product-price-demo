const util = require('util');

function ErrorWithStatus(message, status) {
  ErrorWithStatus.super_.call(this, message);
  this.status = status;
  this.message = message;
}
util.inherits(ErrorWithStatus, Error);

function MissingPropertiesError(missingProperties) {
  const status = 400;
  const message = 'Missing properties';
  MissingPropertiesError.super_.call(this, message, status);
  this.missingProperties = missingProperties;
}
util.inherits(MissingPropertiesError, ErrorWithStatus);

module.exports = {
  MissingPropertiesError,
  ErrorWithStatus
};
