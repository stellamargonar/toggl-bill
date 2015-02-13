# routes 
requestHandlers = require './requestHandlers'
express = require 'express'

API_PREFIX = '/api'



exports.router = (config) ->
    router = express.Router();

    # add log to the console for every request
    router.use (req, res, next) ->
        console.log req.method, req.url
        next()

    project_dir = ((__dirname.split '/')[.. -3] ).join '/'

    router.use express.static project_dir + '/app/bower_components'
    router.use express.static project_dir + '/app/public'
    
    # render home page
    router.get '/' , (req, res) ->
        res.render 'index.jade'

    # render partial views
    router.get '/views/partials/:viewname', (req, res) ->
        viewName = req.params.viewname
        res.render 'partials/' + viewName

    # add access control header
    router.use API_PREFIX , (req, res, next) ->
        res.setHeader 'Access-Control-Allow-Origin', 'http://localhost:8000'
        res.setHeader 'Access-Control-Allow-Methods', 'GET'
        res.setHeader 'Access-Control-Allow-Headers', 'X-Requested-With,content-type'
        next()

    # API ROUTES

    router.route API_PREFIX + '/projects'
        .get (req, res, next) =>
            requestHandlers.project req, res, config

    router.route API_PREFIX + '/project/:pid/timeEntries'
        .get (req, res, next) =>
            requestHandlers.timeEntries req, res, config
    router
