const { ErrorWithStatus } = require('./errors');
const productService = require('../services/productService');

function create(req, res, next) {
  return productService.create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      if (err.message === 'duplicate description') {
        return next(new ErrorWithStatus(`A product with this description already exists: ${req.body.description}`, 409));
      }
      return next(err);
    });
}

module.exports = {
  create
};
