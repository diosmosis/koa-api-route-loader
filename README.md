# koa-api-route-loader

Simple function that adds routes to a koa-router instance by descending through a directory of files and constructing paths for exported generators.

Allows you to organize your routes using a directory structure that mirrors your API's structure.

## Basic Usage

```
var loadRoutes = require('koa-api-route-loader');
var koaRouter = require('koa-router');
var app = require('koa')();

var router = koaRouter();
loadRoutes(router, 'path/to/routes', '/api/uri/base/');

app.use(router.routes());
app.use(router.allowedMethods());
```

With a directory structure that looks like this:

**path/to/routes/users/index.js**:
```
exports.get = function * getAllUsers() {
  // ...
};
```

**path/to/routes/users/user/index.js**:
```
exports.route = '/:id/';

exports.get = function * getUser() {
  // ...
};

exports.put = function * putUser() {
  // ...
};

exports.del = function * deleteUser() {
  // ...
};
```

**path/to/routes/users/user/roles.js**:
```
exports.get = function * getUserRoes() {
  // ...
};
```

the following routes will be created:

* `GET /api/uri/base/users` => `getAllUsers()`
* `GET /api/uri/base/users/:id` => `getUser()`
* `UPDATE /api/uri/base/users/:id` => `putUser()`
* `DELETE /api/uri/base/users/:id` => `deleteUser()`
* `GET /api/uri/base/users/:id/roles` => `getUserRoes()`
