const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');

let _desc = 'integration_test_' + Math.floor(Date.now() / 1000) + '_desc';
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
    }));

  it('should get product with specified id', () => request(app)
    .get(`/api/products/${_id}`)
    .expect(200)
    .then((data) => {
      assert.equal(data.body.cost, 4.5);
    }));

  it('should return an error bad request if the id isn\'t a mongoose object id', () => request(app)
    .get('/api/products/1')
    .expect(400));

  it('should return an error not found if the product with this id isn\'t found', () => request(app)
    .get('/api/products/56e6dd2eb4494ed008d595bd')
    .expect(404));
});
