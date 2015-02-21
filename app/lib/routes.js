(function() {
  var API_PREFIX, express, requestHandlers;

  requestHandlers = require('./requestHandlers');

  express = require('express');

  API_PREFIX = '/api';

  exports.router = function(config) {
    var project_dir, router;
    router = express.Router();
    router.use(function(req, res, next) {
      console.log(req.method, req.url);
      return next();
    });
    project_dir = (__dirname.split('/')).slice(0, -2).join('/');
    router.use(express["static"](project_dir + '/app/bower_components'));
    router.use(express["static"](project_dir + '/app/public'));
    router.get('/', function(req, res) {
      return res.render('index.jade');
    });
    router.get('/views/partials/:viewname', function(req, res) {
      var viewName;
      viewName = req.params.viewname;
      return res.render('partials/' + viewName);
    });
    router.use(API_PREFIX, function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      return next();
    });
    router.route(API_PREFIX + '/projects').get((function(_this) {
      return function(req, res, next) {
        return requestHandlers.project(req, res, config);
      };
    })(this));
    router.route(API_PREFIX + '/project/:pid/timeEntries').get((function(_this) {
      return function(req, res, next) {
        return requestHandlers.timeEntries(req, res, config);
      };
    })(this));
    router.route(API_PREFIX + '/project/:pid/billing').get((function(_this) {
      return function(req, res, next) {
        return requestHandlers.billing(req, res, config);
      };
    })(this));
    return router;
  };

}).call(this);
