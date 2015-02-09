require_helper = require './require_helper'
togglClientClass = require_helper('../lib/index').TogglClient;
url = require 'url'
querystring = require 'querystring'

start = (response) ->
	console.log 'request handler start was called'
	body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead 200 , {"Content-Type": "text/html"}
    response.write body
    response.end()


project = (response, request, config) ->
	togglClient = new togglClientClass config.profile, config.api

	togglClient.getProjectList (data) ->
		response.writeHead 200, {"Content-Type": "application/json"}
		response.write JSON.stringify data
		response.end()

timeEntries = (response, request, config) ->
#    projectId = ((url.parse request.url).pathname.split '/')[2]

    query = (url.parse request.url).query
    if !query
        response.writeHead 400
        response.write '400 Bad Request'
        response.end()
    else
        parameters = querystring.parse query
        if !parameters.projectId
            response.writeHead 400
            response.write '400 Bad Request'
            response.end()
        else
            projectId = parameters.projectId
            startDate = parameters.startDate
            endDate = parameters.endDate

            togglClient = new togglClientClass config.profile, config.api
            togglClient.getProjectTimeEntries projectId, startDate, endDate, (data) =>
                response.writeHead 200, {"Content-Type": "application/json"}
                response.write JSON.stringify data
                response.end()



exports.start = start;
exports.project = project;
exports.timeEntries = timeEntries;
