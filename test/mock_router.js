module.exports = MockRouter;

// handler's given to MockRouter MUST have a unique function name
function MockRouter() {
  this.routes = [];
}

['get', 'put', 'post', 'del'].forEach(function (verb) {
  MockRouter.prototype[verb] = function (routePath, handler) {
    this.routes.push([verb, routePath, handler.name]);
  }
});
