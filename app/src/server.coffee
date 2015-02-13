http        = require 'http'
url         = require 'url'
express     = require 'express'
path        = require 'path'
router      = (require './routes').router


start = () ->
    project_dir = ((__dirname.split '/')[.. -3] ).join '/'
    config = require(project_dir + '/config.js')

    app = express()
    console.log __dirname
    console.log project_dir

    # serve index and view partials
    app.use '/', router config

    # configure app
    
    app.set 'views' , project_dir + '/app/views'
    app.set 'view engine', 'jade'
    app.engine('html', require('ejs').renderFile);
    app.engine('jade', require('jade').__express);




    app.listen(8000)

    # Put a friendly message on the terminal
    console.log "Server running at " + app.host + ':' + app.port


start()