require_helper = require './require_helper'
togglClientClass = require_helper('../lib/index').TogglClient;
billingClass = require_helper('../lib/index').Billing;
url = require 'url'
querystring = require 'querystring'

project = (req, res, config) ->
	togglClient = new togglClientClass config.profile, config.api

	togglClient.getProjectList (data) ->
        res.send data

timeEntries = (req, res, config) ->
    projectId = req.params.pid

    query = (url.parse req.url).query
    parameters = querystring.parse query
    startDate = parameters.startDate
    endDate = parameters.endDate

    togglClient = new togglClientClass config.profile, config.api
    togglClient.getProjectTimeEntries projectId, startDate, endDate, (data) =>
        res.send data

billing = (req, res, config) ->
    projectId = req.params.pid

    query = (url.parse req.url).query
    parameters = querystring.parse query
    startDate = parameters.startDate
    endDate = parameters.endDate
    billingConfig = parameters.config

    togglClient = new togglClientClass config.profile, config.api
    togglClient.getProjectTimeEntries projectId, startDate, endDate, (data) =>
        console.log 'sending Config'
        console.log billingConfig
        billing = new billingClass billingConfig
        result = billing.computeBillableHours projectId , data.result
        res.send result
        
exports.project = project;
exports.timeEntries = timeEntries;
exports.billing = billing;
