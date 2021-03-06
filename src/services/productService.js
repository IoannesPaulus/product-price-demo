const fetch = require('node-fetch');
const _ = require('lodash');
const { ObjectId } = require('mongoose').Types;

const Product = require('../db/models/product');
const config = require('../config');

function create(productData) {
  return Product.create(productData)
    .catch((err) => {
      if (err.message.startsWith('E11000')) {
        throw new Error('duplicate description');
      }
      throw err;
    });
}

function findAll() {
  return Product.find({});
}

function findById(id) {
  return Product.findById(id);
}

function updateById(id, newData) {
  return Product.findOneAndUpdate({ _id: id }, newData, { new: true });
}

function removeById(id) {
  return Product.remove({ _id: id })
    .then((data) => {
      if (data.n === 0) {
        throw new Error('not found');
      }
      return { success: data.ok };
    });
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  const err = new Error(response.statusText);
  err.status = response.status;
  return Promise.reject(err);
}

function json(response) {
  return response.json();
}

function getPrice(id, currency) {
  if (!currency || currency === 'USD') {
    return Product.findById(id).select('price');
  }
  return fetch(`${config.get('currencyConverter')}?base=USD&symbols=${currency}`)
    .then(status)
    .then(json)
    .then((currRes) => {
      if (currRes.error) {
        throw new Error(`Conversion: ${currRes.error}`);
      }
      if (_.isEmpty(currRes.rates)) {
        throw new Error('invalid currency');
      }
      return currRes.rates[currency];
    })
    .then(rate => Promise.all([rate, Product.findById(id).select('price')]))
    .then(([rate, product]) => {
      const price = product.price * rate;
      return {
        _id: product._id,
        price,
        id: product.id,
        currency
      };
    });
}

function getTotalPriceAndCost(id) {
  return Product.aggregate([
    {
      $match: {
        _id: ObjectId(id)
      }
    },
    {
      $project: {
        _id: 1,
        description: 1,
        totalCost: { $multiply: ['$cost', '$stock'] },
        totalPrice: { $multiply: ['$price', '$stock'] }
      }
    }
  ]).then((matches) => {
    if (matches.length === 0) {
      return null;
    }
    return matches[0];
  });
}

function getSumTotalPriceAndCost() {
  return Product.aggregate([
    {
      $group: {
        _id: null,
        totalCost: { $sum: { $multiply: ['$cost', '$stock'] } },
        totalPrice: { $sum: { $multiply: ['$price', '$stock'] } }
      }
    }
  ]).then((sum) => {
    if (sum.length === 0) {
      return {
        _id: null,
        totalCost: 0,
        totalPrice: 0
      };
    }
    return sum[0];
  });
}

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  removeById,
  getPrice,
  getTotalPriceAndCost,
  getSumTotalPriceAndCost
};
