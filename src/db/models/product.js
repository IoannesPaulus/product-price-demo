const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongo = require('../mongo');

const schemaOptions = {
  toJSON: {
    virtuals: true
  },
  timestamps: true
};

/**
 * Product Schema
 */
const productSchema = new Schema({
  description: {
    type: String,
    required: true,
    unique: true
  },
  cost: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
}, schemaOptions);

module.exports = mongo.model('Product', productSchema);
