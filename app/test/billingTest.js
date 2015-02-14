/*global describe, it, before, after*/
/*jshint expr: true*/

'use strict';
require('should');
var nock = require('nock');

var requireHelper = require('./require_helper');
var billingClass = requireHelper('../lib/index').Billing;

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
var billingConfig = {
	salaryPerHour 	: 5,
	salaryPerCall	: 6
};

describe('billing.constructor', function() {
	it('should throw error when config is missing', function() {
		(function() {
			new billingClass();
		}).should.throw();
	});
	it('should throw error when config is undefined', function() {
		(function() {
			new billingClass(undefined);
		}).should.throw();
	});
	it('should throw error when config is empty', function() {
		(function() {
			new togglClientClass({});
		}).should.throw();
	});
	it('should throw error when config has salary per Call', function() {
		(function() {
			new billingClass({salaryPerHour:1});
		}).should.throw();
	});
	it('should throw error when properties are not numbers', function() {
		(function() {
			new billingClass({salaryPerHour:'token', salaryPerCall: {}});
		}).should.throw();
	});

	it('should create an billing instance when passing the right parameters', function() {
		var billing = new billingClass(billingConfig);
		(billing).should.not.be.undefined;
	});
});

describe('billing.computeBillableHours', function() {
	var billing;
	before(function() {
		billing = new billingClass(billingConfig);
	});

	it('should throw error when projectid is not passed', function() {
		(function() {
			billing.computeBillableHours();
		}).should.throw();
	});
	it('should throw error when projectid is undefined', function() {
		(function() {
			billing.computeBillableHours(undefined);
		}).should.throw();
	});
	it('should throw error when no time entry is passed', function() {
		(function() {
			billing.computeBillableHours(1234);
		}).should.throw();
	});
	it('should return 0 when time entry is empty', function() {
		var result = billing.computeBillableHours(123, []);
		(result).should.not.be.undefined;
		result.total.should.be.eql(0);
	});
	it('should compute bill with 1 call when all time entries are in 1 day', function() {
		var timeEntries =[
		{
			duration: 100,
			start 	: new Date()
		},
		{
			duration: 50,
			start 	: new Date()
		}
		];
		var expected = (50+100)*billingConfig.salaryPerHour + billingConfig.salaryPerCall;

		var result = billing.computeBillableHours(123, timeEntries).total;
		(result).should.not.be.undefined;
		result.should.be.eql(expected);
	});

	it('should compute bill with calls in different days', function() {
		var timeEntries =[
		{
			duration: 100,
			start 	: new Date()
		},
		{
			duration: 50,
			start 	: new Date('2015-01-30')
		}
		];
		var expected = (50+100)*billingConfig.salaryPerHour + 2*billingConfig.salaryPerCall;

		var result = billing.computeBillableHours(123, timeEntries).total;
		(result).should.not.be.undefined;
		result.should.be.eql(expected);
	});
});

