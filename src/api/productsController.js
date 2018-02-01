const _ = require('lodash');

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

function updateById(req, res, next) {
  if (req.body.description === undefined && req.body.cost === undefined &&
    req.body.price === undefined && req.body.stock === undefined) {
    return next(new ErrorWithStatus('No update values were specified', 400));
  }
  const newData = {};
  if (req.body.description !== undefined) {
    _.assign(newData, { description: req.body.description });
  }
  if (req.body.cost !== undefined) {
    _.assign(newData, { cost: req.body.cost });
  }
  if (req.body.price !== undefined) {
    _.assign(newData, { price: req.body.price });
  }
  if (req.body.stock !== undefined) {
    _.assign(newData, { stock: req.body.stock });
  }
  return productService.updateById(req.params.id, newData)
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
  getById,
  updateById
};
