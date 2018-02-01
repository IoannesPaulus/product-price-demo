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

function updateById(id, newData) {
  return Product.findOneAndUpdate({ _id: id }, newData, { new: true });
}

module.exports = {
  create,
  findAll,
  findById,
  updateById
};
