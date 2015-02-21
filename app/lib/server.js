(function() {
  var express, http, path, router, start, url;

  http = require('http');

  url = require('url');

  express = require('express');

  path = require('path');

  router = (require('./routes')).router;

  start = function() {
    var app, config, project_dir;
    project_dir = (__dirname.split('/')).slice(0, -2).join('/');
    config = require(project_dir + '/config.js');
    app = express();
    console.log(__dirname);
    console.log(project_dir);
    app.use('/', router(config));
    app.set('views', project_dir + '/app/views');
    app.set('view engine', 'jade');
    app.engine('html', require('ejs').renderFile);
    app.engine('jade', require('jade').__express);
    app.listen(8000);
    return console.log("Server running at " + app.host + ':' + app.port);
  };

  start();

}).call(this);
