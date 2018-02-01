const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');

let _desc = 'integration_test_' + Math.floor(Date.now() / 1000) + '_desc';
let _desc2 = `${_desc}2`;
let _id = null;

describe('Products controller', () => {
  it('should create a product', () => request(app)
    .post('/api/products')
    .send({
      description: _desc,
      cost: 4.5,
      price: 5.3,
      stock: 3
    })
    .expect(200)
    .then((data) => {
      assert.equal(data.body.description, _desc);
      assert.equal(data.body.cost, 4.5);
      assert.equal(data.body.price, 5.3);
      assert.equal(data.body.stock, 3);
      assert.equal(data.body.id, data.body._id);
      _id = data.body.id;
    }));

  it('should create a second product', () => request(app)
    .post('/api/products')
    .send({
      description: _desc2,
      cost: 5.5,
      price: 7.0,
      stock: 4
    })
    .expect(200)
    .then((data) => {
      assert.equal(data.body.description, _desc2);
      assert.equal(data.body.cost, 5.5);
      assert.equal(data.body.price, 7.0);
      assert.equal(data.body.stock, 4);
      assert.equal(data.body.id, data.body._id);
    }));

  it('should return an error conflict if a product with this description already exists', () => request(app)
    .post('/api/products')
    .send({
      description: _desc,
      cost: 4.5,
      price: 5.3,
      stock: 3
    })
    .expect(409));

  it('should return an error bad request if one of the attributes isn\'t specified', () => request(app)
    .post('/api/products')
    .send({
      cost: 4.5,
      price: 5.3,
      stock: 3
    })
    .expect(400));

  it('should list all products', () => request(app)
    .get('/api/products')
    .expect(200)
    .then((data) => {
      assert(Array.isArray(data.body));
      assert.isAtLeast(data.body.length, 2);
    }));

  it('should get product with specified id', () => request(app)
    .get(`/api/products/${_id}`)
    .expect(200)
    .then((data) => {
      assert.equal(data.body.cost, 4.5);
      assert.equal(data.body.price, 5.3);
    }));

  it('should return an error bad request if the id isn\'t a mongoose object id', () => request(app)
    .get('/api/products/1')
    .expect(400));

  it('should return an error not found if the product with this id isn\'t found', () => request(app)
    .get('/api/products/56e6dd2eb4494ed008d595bd')
    .expect(404));

  it('should get the USD price of a product with the specified id', () => request(app)
    .get(`/api/products/${_id}/price`)
    .expect(200)
    .then((data) => {
      assert.equal(data.body.price, 5.3);
      assert.isUndefined(data.body.cost);
    }));

  it('should get the HUF price of a product with the specified id', () => request(app)
    .get(`/api/products/${_id}/price?currency=HUF`)
    .expect(200)
    .then((data) => {
      assert.notEqual(data.body.price, 5.3);
      assert.isUndefined(data.body.cost);
      assert.equal(data.body.currency, 'HUF');
    }));

  it('should return an error bad request if currency is invalid', () => request(app)
    .get(`/api/products/${_id}/price?currency=HUG`)
    .expect(400));

  it('should return an error bad request if currency is in the wrong format', () => request(app)
    .get(`/api/products/${_id}/price?currency=huf`)
    .expect(400));

  it('should get total cost and price for stock of product with specified id', () => request(app)
    .get(`/api/products/${_id}/total`)
    .expect(200)
    .then((data) => {
      assert.equal(data.body.totalCost, 13.5);
      assert.equal(data.body.totalPrice, 15.899999999999999);
    }));

  it('should get total cost and price for the entire stock', () => request(app)
    .get('/api/sumStock')
    .expect(200)
    .then((data) => {
      assert.isAtLeast(data.body.totalCost, 79.5);
      assert.isAtLeast(data.body.totalPrice, 99.9);
    }));

  it('should update product with specified id', () => request(app)
    .put(`/api/products/${_id}`)
    .send({
      cost: 5.1
    })
    .expect(200)
    .then((data) => {
      assert.equal(data.body.cost, 5.1);
    }));

  it('should return an error bad request if the update id isn\'t a mongoose object id', () => request(app)
    .put('/api/products/1')
    .expect(400));

  it('should return an error bad request if the there is nothing to update', () => request(app)
    .put(`/api/products/${_id}`)
    .send({
    })
    .expect(400));

  it('should return an error bad request if the there are unknown parameters', () => request(app)
    .put(`/api/products/${_id}`)
    .send({
      cost: 5.1,
      wat: 3
    })
    .expect(400));

  it('should return an error not found if the product to update with this id isn\'t found', () => request(app)
    .put('/api/products/56e6dd2eb4494ed008d595bd')
    .send({
      cost: 5.1
    })
    .expect(404));

  it('should delete product with specified id', () => request(app)
    .delete(`/api/products/${_id}`)
    .expect(200)
    .then((data) => {
      assert.equal(data.body.success, 1);
    }));

  it('should return an error bad request if the id to delete isn\'t a mongoose object id', () => request(app)
    .delete('/api/products/1')
    .expect(400));

  it('should return an error not found if the product to delete isn\'t found', () => request(app)
    .delete('/api/products/56e6dd2eb4494ed008d595bd')
    .expect(404));
});
