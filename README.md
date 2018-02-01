## Product price demo Node.js backend

### You need:
* Node.js 8.x

### Start server:
```
npm install
npm run start
```

### Run integration tests:
```
npm run test
```

### Endpoints:
#### Products CRUD examples
```
POST http://localhost:3000/api/products
{
	"description": "Nestlé Chocolate Bar",
	"cost": 4.5,
	"price": 5.3,
	"stock": 200
}
```
```
GET http://localhost:3000/api/products
```
```
GET http://localhost:3000/api/products/5a70f4c887906848c6a62a45
```
```
PUT http://localhost:3000/api/products/5a70f4c887906848c6a62a45
{
	"stock": 206
}
```
```
DELETE http://localhost:3000/api/products/5a70f4c887906848c6a62a45
```
#### List product price in given currency examples
* USD:
```
GET http://localhost:3000/api/products/5a70f4c887906848c6a62a45/price
```
* HUF:
```
GET http://localhost:3000/api/products/5a70f4c887906848c6a62a45/price?currency=HUF
```
Description for the used currency conversion API:
http://fixer.io/
#### Total price and cost for entire stock of any given product
```
GET http://localhost:3000/api/products/5a70f4c887906848c6a62a45/total
```
#### Total price and cost for entire stock of products
```
GET http://localhost:3000/api/sumStock
```
