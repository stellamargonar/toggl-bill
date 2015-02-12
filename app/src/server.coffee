http        = require 'http'
url         = require 'url'
requestHandlers = require './requestHandlers'
express = require 'express'
path = require('path');


handle = 
    '/api/'                         : requestHandlers.start,
    '/api/projects'                 : requestHandlers.project,
    '/api/timeEntries'  : requestHandlers.timeEntries

API_PREFIX = '/api'


start = () ->
    project_dir = ((__dirname.split '/')[.. -3] ).join '/'
    console.log project_dir
    config = require(project_dir + '/config.js')

    console.log project_dir + '/app/bower_components'

#   server = http.createServer onRequest
#   server.listen 8000
    app = express()

    app.use express.static project_dir + '/app/bower_components'
    app.use express.static project_dir + '/app/public'
    app.use express.static project_dir + '/app'

    app.use express.static project_dir + '/app/project'
    app.set 'views' , project_dir + '/app/'

    app.engine('html', require('ejs').renderFile);

    app.use (req, res, next) =>
        res.setHeader 'Access-Control-Allow-Origin', 'http://localhost:8000'
        res.setHeader 'Access-Control-Allow-Methods', 'GET'
        res.setHeader 'Access-Control-Allow-Headers', 'X-Requested-With,content-type'
        next()

    app.get '/', (req, res) =>
        res.render 'index.html', {}

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