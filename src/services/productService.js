const Product = require('../db/models/product');

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

module.exports = {
  create,
  findAll,
  findById
};
