http 		= require 'http'
url 		= require 'url'
requestHandlers = require './requestHandlers'
express = require 'express'


handle = 
	'/api/'							: requestHandlers.start,
	'/api/projects'					: requestHandlers.project,
	'/api/timeEntries'	: requestHandlers.timeEntries

API_PREFIX = '/api'


start = () ->
	project_dir = ((__dirname.split '/')[.. -3] ).join '/'
	config = require(project_dir + '/config.js')

#	server = http.createServer onRequest
#	server.listen 8000
	app = express()


	app.route API_PREFIX + '/projects'
		.get (req, res, next) =>
			requestHandlers.project req , res , config 
	
	app.route API_PREFIX + '/project/:pid/timeEntries'
		.get (req, res, next) =>
			requestHandlers.timeEntries req , res , config


	http.createServer(app).listen(8000)

	# Put a friendly message on the terminal
	console.log "Server running at http://127.0.0.1:8000/"


start()