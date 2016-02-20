var fs = require('fs');
var path = require('path');

module.exports = loadRoutes;

function loadRoutes(router, basePath, uriPath) {
  uriPath = loadOptionalDirectoryRoute(router, basePath, uriPath);

  fs.readdirSync(basePath).forEach(function (segment) {
    if (segment == '.' || segment == '..' || /^index\./.test(segment)) {
      return;
    }

    var wholeUriPath = path.join(uriPath, segment);
    var wholePath = path.join(basePath, segment);

    var stats = fs.lstatSync(wholePath);
    if (stats.isSymbolicLink()) {
      return;
    }

    if (stats.isDirectory()) {
      loadRoutes(router, wholePath, wholeUriPath);
    } else {
      loadRoute(router, wholePath, wholeUriPath);
    }
  });
}

function loadRoute(router, basePath, uriPath) {
  if (/\.js$/.test(basePath)) {
    uriPath = uriPath.substring(0, uriPath.length - '.js'.length);
  } else if (/\.coffee$/.test(basePath)) {
    uriPath = uriPath.substring(0, uriPath.length - '.coffee'.length);
  }

  setRoute(router, uriPath, require(basePath));
}

function loadOptionalDirectoryRoute(router, basePath, uriPath) {
  var directoryModule = null;
  try {
    // append index.js so we get the directory in case there's a file w/ the same name
    directoryModule = require(path.join(basePath, 'index.js'));
  } catch (e) {
    return uriPath;
  }

  if (directoryModule.route) {
    uriPath = path.dirname(uriPath);
    uriPath = path.join(uriPath, directoryModule.route);
  }

  setRoute(router, uriPath, directoryModule);

  return uriPath;
}

function setRoute(router, uriPath, mod) {
  for (var method in mod) {
    if (!mod.hasOwnProperty(method) || method == 'route') {
      continue;
    }

    var handler = mod[method];
    router[method](handler.route || uriPath, handler);
  }
}
