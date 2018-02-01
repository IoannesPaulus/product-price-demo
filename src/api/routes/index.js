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

router.put('/products/:id', celebrate({
  params: {
    id: Joi.objectId()
  },
  body: Joi.object().keys({
    description: Joi.string(),
    cost: Joi.number().min(0),
    price: Joi.number().min(0),
    stock: Joi.number().integer().min(0)
  })
}), productsController.updateById);

router.delete('/products/:id', celebrate({
  params: {
    id: Joi.objectId()
  }
}), productsController.deleteById);

router.get('/products/:id/price', celebrate({
  params: {
    id: Joi.objectId()
  },
  query: {
    currency: Joi.string().regex(/^[A-Z]{3}$/)
  }
}), productsController.getPrice);

router.get('/products/:id/total', celebrate({
  params: {
    id: Joi.objectId()
  }
}), productsController.getTotalPriceAndCost);

router.get('/sumStock', productsController.getSumTotalPriceAndCost);

module.exports = router;
