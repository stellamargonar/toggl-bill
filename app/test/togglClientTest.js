/*global describe, it, before, after*/
/*jshint expr: true*/

'use strict';
require('should');
var nock = require('nock');

var requireHelper = require('./require_helper');
var togglClientClass = requireHelper('../lib/index').TogglClient;

var profileConfig = {
	api_token				: "token",
	user_agent 				: "mail@mymail.com",
	workspace_api_token 	: "workspace_token",
	workspace_id 			: 1235
};
var apiConfig = {
	host 			: 'https://www.toggl.com/',
	projects		: 'api/v8/workspaces/:workspace_id/projects',
	clients 		: 'api/v8/workspaces/:workspace_id/clients',
	clientProjects	: 'api/v8/clients/:client_id/projects',
	timeEntries		: 'api/v8/time_entries',
	weeklyReport	: 'reports/api/v2/weekly',
	detailedReport	: 'reports/api/v2/details',
	summaryReport	: 'reports/api/v2/summary'
};

describe('togglClient.constructor', function() {
	it('should throw error when config is missing', function() {
		(function() {
			new togglClientClass();
		}).should.throw();
	});
	it('should throw error when config is undefined', function() {
		(function() {
			new togglClientClass(undefined);
		}).should.throw();
	});
	it('should throw error when api config is missing', function() {
		(function() {
			new togglClientClass(profileConfig);
		}).should.throw();
	});
	it('should throw error when config has no api token', function() {
		(function() {
			new togglClientClass({});
		}).should.throw();
	});
	it('should throw error when config has no user agent', function() {
		(function() {
			new togglClientClass({api_token:'token'});
		}).should.throw();
	});
	it('should throw error when config has no workspace_id', function() {
		(function() {
			new togglClientClass({api_token:'token', user_agent: 'email@email.com'});
		}).should.throw();
	});

	it('should create an togglClient with the api token when passing the right parameters', function() {
		var client = new togglClientClass(profileConfig, apiConfig);
		(client.profileConfig.api_token).should.not.be.undefined;
		client.profileConfig.api_token.should.be.eql(profileConfig.api_token);
	});
});


describe('togglClient.getProjectList', function() {
	var togglClient = null;

	before(function() {
		togglClient = new togglClientClass(profileConfig, apiConfig);
	});

	it('should throw error when no parameter is passed', function() {
		(function() {
			togglClient.getProjectList();
		}).should.throw();
	});
	it('should throw error when callback is not a function', function() {
		(function() {
			togglClient.getProjectList({});
		}).should.throw();
	});
	it('should return empty when api is 404', function(done) {
		var pathname = apiConfig.projects.replace(':workspace_id', profileConfig.workspace_id);

		nock(apiConfig.host, {
      		reqheaders: {
      			'authorization': 'Basic Auth',
      			'user'	: profileConfig.api_token,
        		'pass'	: 'api_token'
      		}
    	})
    	.get(pathname)
    	.reply(404);

    	togglClient.getProjectList(function(data) {
    		(data).should.not.be.undefined;
    		data.should.be.empty;
    		done();
    	});

	});
	it('should return empty when api returns empty result', function(done) {
		var pathname = apiConfig.projects.replace(':workspace_id', profileConfig.workspace_id);

		nock(apiConfig.host, {
      		reqheaders: {
      			'authorization': 'Basic Auth',
      			'user'	: profileConfig.api_token,
        		'pass'	: 'api_token'
      		}
    	})
    	.get(pathname)
    	.reply(200, []);

    	togglClient.getProjectList(function(data) {
    		(data).should.not.be.undefined;
    		data.should.be.empty;
    		done();
    	});

	});

	it('should return project list when api return results', function(done) {
		var body = [{ 
	        "id": 8333777,
	        "guid": "97312782-0802-4810-804b-fe90b1bf9da4",
	        "wid": 718298,
	        "cid": 16106939,
	        "name": "Sito Cave Chizzola",
	        "billable": false,
	        "is_private": true,
	        "active": true,
	        "template": false,
	        "at": "2015-01-22T14:38:18+00:00",
	        "created_at": "2015-01-22T08:44:23+00:00",
	        "color": "6",
	        "auto_estimates": false,
	        "actual_hours": 4
	    },
	    {
	        "id": 7073535,
	        "guid": "e5f87d38-fe4c-4aaf-9393-23e5e10cf049",
	        "wid": 718298,
	        "cid": 15884083,
	        "name": "Sito",
	        "billable": false,
	        "is_private": true,
	        "active": true,
	        "template": false,
	        "at": "2014-11-19T09:49:05+00:00",
	        "created_at": "2014-11-19T09:48:02+00:00",
	        "color": "13",
	        "auto_estimates": false,
	        "actual_hours": 3
	    }];
		var apiConfig2 = {
			host 			: 'https://www.toggle.com/',
			projects		: 'apiss/v8/workspaces/:workspace_id/projects'
		};
		togglClient = new togglClientClass(profileConfig, apiConfig2);


		var pathname = apiConfig2.projects.replace(':workspace_id', profileConfig.workspace_id);
				
    	console.log(apiConfig2.host + pathname);
		nock(apiConfig2.host)
    	.get(pathname)
    	.reply(200, body);

    	togglClient.getProjectList(function(data) {
    		(data).should.not.be.undefined;
    		data.should.not.be.empty;
    		done();
    	});

	});












});