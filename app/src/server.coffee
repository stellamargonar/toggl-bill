http 		= require 'http'
url 		= require 'url'
requestHandlers = require './requestHandlers'


handle = 
	'/api/'							: requestHandlers.start,
	'/api/projects'					: requestHandlers.project,
	'/api/timeEntries'	: requestHandlers.timeEntries

route = (handle, pathname, response, request, config) ->
	if typeof handle[pathname] is 'function'
  		handle[pathname] response , request, config
	else
	    response.writeHead 404, {"Content-Type": "text/html"}
	    response.write "404 Not found"
	    response.end()

start = (route, handle) ->
	project_dir = ((__dirname.split '/')[.. -3] ).join '/'
	config = require(project_dir + '/config.js')

	onRequest = (request, response) =>
		pathname = (url.parse request.url).pathname
		route handle , pathname , response, request, config


	server = http.createServer onRequest
	server.listen 8000

	# Put a friendly message on the terminal
	console.log "Server running at http://127.0.0.1:8000/"


start route , handle