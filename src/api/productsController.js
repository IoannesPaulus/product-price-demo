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

function listAll(req, res, next) {
  return productService.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch(next);
}

function getById(req, res, next) {
  return productService.findById(req.params.id)
    .then((data) => {
      if (data === null) {
        next(new ErrorWithStatus(`Product with this id does not exist: ${req.params.id}`, 404));
      } else {
        res.json(data);
      }
    })
    .catch(next);
}

module.exports = {
  create,
  listAll,
  getById
};
