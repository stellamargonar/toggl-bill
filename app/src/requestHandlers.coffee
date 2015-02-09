require_helper = require './require_helper'
togglClientClass = require_helper('../lib/index').TogglClient;

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
		console.log data
		if !data
			body = '<html><body>500</body></html>'
		body = '<html><body><ul>'
		for index, item of data
			body += '<li>' + item.name + ' [' +item.id +  ']</li>'
		body += '</ul></body></html>' 

		response.writeHead 200, {"Content-Type": "text/html"}
		response.write body
		response.end()

exports.start = start;
exports.project = project;