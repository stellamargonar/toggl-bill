(function() {
  var billing, billingClass, project, querystring, require_helper, timeEntries, togglClientClass, url;

  require_helper = require('./require_helper');

  togglClientClass = require_helper('../lib/index').TogglClient;

  billingClass = require_helper('../lib/index').Billing;

  url = require('url');

  querystring = require('querystring');

  project = function(req, res, config) {
    var togglClient;
    togglClient = new togglClientClass(config.profile, config.api);
    return togglClient.getProjectList(function(data) {
      return res.send(data);
    });
  };

  timeEntries = function(req, res, config) {
    var endDate, parameters, projectId, query, startDate, togglClient;
    projectId = req.params.pid;
    query = (url.parse(req.url)).query;
    parameters = querystring.parse(query);
    startDate = parameters.startDate;
    endDate = parameters.endDate;
    togglClient = new togglClientClass(config.profile, config.api);
    return togglClient.getProjectTimeEntries(projectId, startDate, endDate, (function(_this) {
      return function(data) {
        return res.send(data);
      };
    })(this));
  };

  billing = function(req, res, config) {
    var billingConfig, endDate, parameters, projectId, query, startDate, togglClient;
    projectId = req.params.pid;
    query = (url.parse(req.url)).query;
    parameters = querystring.parse(query);
    startDate = parameters.startDate;
    endDate = parameters.endDate;
    billingConfig = parameters.config;
    togglClient = new togglClientClass(config.profile, config.api);
    return togglClient.getProjectTimeEntries(projectId, startDate, endDate, (function(_this) {
      return function(data) {
        var result;
        console.log('sending Config');
        console.log(billingConfig);
        billing = new billingClass(billingConfig);
        result = billing.computeBillableHours(projectId, data.result);
        return res.send(result);
      };
    })(this));
  };

  exports.project = project;

  exports.timeEntries = timeEntries;

  exports.billing = billing;

}).call(this);
