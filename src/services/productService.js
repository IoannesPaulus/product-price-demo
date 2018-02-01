const Product = require('../db/models/product');

function create(productData) {
  return Product.create(productData)
    .catch((err) => {
      if (err.message.startsWith('E11000')) {
        throw new Error('duplicate description');
      }
    });
}

module.exports = {
  create
};
