var expect = require('chai').expect;
var path = require('path');

describe("route loader", function () {
  var loadRoutes = require('../lib');
  var MockRouter = require('./mock_router');

  it("should recursively load files in a directory and process them as route paths", function () {
    var mockRouter = new MockRouter();

    var routePath = path.join(__dirname, 'resources', 'route_tree');
    loadRoutes(mockRouter, routePath, '/api/');

    var expectedRoutes = [
      ['get', '/api/hello/to/you/dear', 'hello_to_you_dear'],
      ['del', '/api/hello/to/you', 'hello_to_you'],
      ['get', '/api/hello/world', 'hello_world'],
      ['put', '/api/hello/world', 'hello_world_put'],
      ['post', '/api/hello/world', 'hello_world_post'],
      ['del', '/api/hello/world', 'hello_world_delete']
    ];

    expect(mockRouter.routes).to.be.deep.equal(expectedRoutes);
  });

  it("should ignore index.js when loading files and load it only when setting a branch route", function () {
    var mockRouter = new MockRouter();

    var routePath = path.join(__dirname, 'resources', 'directory_route');
    loadRoutes(mockRouter, routePath, 'api/');

    var expectedRoutes = [
      ['get', 'api/users', 'users'],
      ['put', 'api/users/user', 'single_user'],
      ['post', 'api/users/user/roles', 'single_user_roles']
    ];

    expect(mockRouter.routes).to.be.deep.equal(expectedRoutes);
  });

  it("should allow index.js files to modify all child routes of a branch", function () {
    var mockRouter = new MockRouter();

    var routePath = path.join(__dirname, 'resources', 'directory_modified_tree');
    loadRoutes(mockRouter, routePath, '/to/api/');

    var expectedRoutes = [
      ['get', '/to/api/users', 'users2'],
      ['put', '/to/api/users/:id', 'single_user2'],
      ['post', '/to/api/users/:id/roles', 'single_user_roles2']
    ];

    expect(mockRouter.routes).to.be.deep.equal(expectedRoutes);
  });

  it("should allow individual route generators to override their specific route paths", function () {
    var mockRouter = new MockRouter();

    var routePath = path.join(__dirname, 'resources', 'overridden_route_path');
    loadRoutes(mockRouter, routePath, 'to/api/');

    var expectedRoutes = [
      ['get', 'a/b/c', 'a_b_c'],
      ['del', '/d/e', 'd_e'],
      ['post', 'to/api/', 'root'],
    ];

    expect(mockRouter.routes).to.be.deep.equal(expectedRoutes);
  });
});
