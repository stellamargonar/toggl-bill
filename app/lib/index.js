(function() {
  var TogglClient, querystring, request;

  request = require('request');

  querystring = require('querystring');

  TogglClient = (function() {
    TogglClient._defaultPassword = 'api_token';

    function TogglClient(profileConfig, apiConfig) {
      if (!profileConfig || !apiConfig) {
        throw new Error('MISSING_PARAMETER');
      }
      if (!profileConfig.api_token || !profileConfig.user_agent || !profileConfig.workspace_id) {
        throw new Error('MISSING_PARAMETER');
      }
      this.profileConfig = profileConfig;
      this.apiConfig = apiConfig;
    }

    TogglClient.prototype._doRequest = function(apiUrl, parameters, callback) {
      var headers, requestUrl;
      if (parameters == null) {
        parameters = {};
      }
      headers = {
        'auth': {
          'user': this.profileConfig.api_token,
          'pass': 'api_token'
        }
      };
      requestUrl = this.apiConfig.host + apiUrl;
      if (parameters) {
        requestUrl += '?' + querystring.stringify(parameters);
      }
      console.log('requesting ' + requestUrl);
      return request.get(requestUrl, headers, (function(_this) {
        return function(error, response, body) {
          if (error) {
            console.log(error);
          }
          if (error || response.statusCode !== 200) {
            return callback({
              error: error
            });
          } else {
            return callback({
              result: JSON.parse(body)
            });
          }
        };
      })(this));
    };

    TogglClient.prototype.getClientList = function() {
      return this._doRequest(this.apiConfig.clients.replace(':workspace_id', this.profileConfig.workspace_id), {}, (function(_this) {
        return function(result) {
          return callback(result.result);
        };
      })(this));
    };

    TogglClient.prototype.getProjectList = function(callback) {
      if (!callback) {
        throw new Error('MISSING_PARAMETER');
      }
      if (typeof callback !== 'function') {
        throw new TypeError('INVALID_CALLBACK');
      }
      return this._doRequest(this.apiConfig.projects.replace(':workspace_id', this.profileConfig.workspace_id), {}, (function(_this) {
        return function(result) {
          var newProject, project, projects, _i, _len, _ref;
          if (!result.result) {
            return result;
          } else {
            projects = [];
            _ref = result.result;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              project = _ref[_i];
              newProject = {
                id: project.id,
                name: project.name,
                client_id: project.cid
              };
              projects.push(newProject);
            }
            return callback({
              result: projects
            });
          }
        };
      })(this));
    };

    TogglClient.prototype.getProjectTimeEntries = function(projectId, startDateString, endDateString, callback) {
      var endDate, parameters, startDate;
      if (!projectId || !callback) {
        throw new Error('MISSING_PARAMETER');
      }
      if (isNaN(parseInt(projectId))) {
        throw new TypeError('INVALID_PROJECTID');
      }
      if (typeof callback !== 'function') {
        throw new TypeError('INVALID_CALLBACK');
      }
      if (!startDateString || !endDateString) {
        throw new TypeError('INVALID START END DATE');
      }
      startDate = new Date(parseInt(startDateString));
      endDate = new Date(parseInt(endDateString));
      parameters = {
        workspace_id: this.profileConfig.workspace_id,
        user_agent: this.profileConfig.user_agent,
        project_ids: projectId,
        since: startDate ? startDate.toISOString() : void 0,
        until: endDate ? endDate.toISOString() : void 0
      };
      console.log(parameters);
      return this._doRequest(this.apiConfig.detailedReport, parameters, (function(_this) {
        return function(result) {
          var duration, entries, entry, entryEnd, entryStart, newEntries, newEntry, _i, _len;
          if (!result.result) {
            return callback(result);
          } else {
            entries = result.result.data;
            newEntries = [];
            for (_i = 0, _len = entries.length; _i < _len; _i++) {
              entry = entries[_i];
              if (entry.start) {
                entryStart = new Date(entry.start);
              }
              if (entry.end) {
                entryEnd = new Date(entry.end);
              }
              duration = (entryEnd - entryStart) / 1000;
              newEntry = {
                id: entry.id,
                description: entry.description,
                start: entryStart,
                end: entryEnd,
                pid: entry.pid,
                tags: entry.tags,
                duration: duration
              };
              newEntries.push(newEntry);
            }
            return callback({
              result: newEntries
            });
          }
        };
      })(this));
    };

    return TogglClient;

  })();

  module.exports.TogglClient = TogglClient;

}).call(this);

(function() {
  var Billing, require_helper, togglClientClass;

  require_helper = require('./require_helper');

  togglClientClass = require_helper('../lib/index').TogglClient;

  Billing = (function() {
    function Billing(billingConfig) {
      billingConfig = JSON.parse(billingConfig);
      if (!billingConfig || !billingConfig.salaryPerCall || !billingConfig.salaryPerHour) {
        throw new Error('MISSING_PARAMETER');
      }
      if (isNaN(parseInt(billingConfig.salaryPerHour)) || isNaN(parseInt(billingConfig.salaryPerCall))) {
        throw new TypeError('SALARY IS NOT A NUMBER');
      }
      this.billingConfig = billingConfig;
    }

    Billing.prototype.computeBillableHours = function(projectId, timeEntries) {
      var date, dateToString, days, format, result, timeEntry, totalBilling, totalDuration, totalHour, _i, _len;
      if (!projectId || !timeEntries) {
        throw new Error('MISSING_PARAMETER');
      }
      if (timeEntries.length === 0) {
        result = {
          total: 0,
          totalHour: 0,
          totalCalls: 0
        };
        return result;
      }
      days = {};
      totalDuration = 0;
      format = 'yyyy-MM-dd';
      for (_i = 0, _len = timeEntries.length; _i < _len; _i++) {
        timeEntry = timeEntries[_i];
        totalDuration += timeEntry.duration;
        date = timeEntry.start;
        dateToString = +(date.getYear() + 1990) + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        days[dateToString] = (days[dateToString] || 0) + 1;
      }
      totalHour = totalDuration / 3600;
      return totalBilling = {
        total: totalHour * this.billingConfig.salaryPerHour + (Object.keys(days).length) * this.billingConfig.salaryPerCall,
        totalHour: totalHour,
        totalCalls: (Object.keys(days).length)
      };
    };

    return Billing;

  })();

  module.exports.Billing = Billing;

}).call(this);
