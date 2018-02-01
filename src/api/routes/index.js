const express = require('express');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();
const productsController = require('../productsController');

router.post('/products', celebrate({
  body: Joi.object().keys({
    description: Joi.string().required(),
    cost: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).required()
  })
}), productsController.create);

router.get('/products', productsController.listAll);

router.get('/products/:id', celebrate({
  params: {
    id: Joi.objectId()
  }
}), productsController.getById);

module.exports = router;
