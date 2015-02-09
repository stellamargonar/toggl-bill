request 	= require 'request'
querystring	= require 'querystring'

class TogglClient
	@_defaultPassword = 'api_token'

	constructor : (profileConfig, apiConfig) ->
		if !profileConfig or !apiConfig
			throw new Error 'MISSING_PARAMETER'
		if !profileConfig.api_token or !profileConfig.user_agent or !profileConfig.workspace_id
			throw new Error 'MISSING_PARAMETER'
		@profileConfig = profileConfig
		@apiConfig = apiConfig


	_doRequest : (apiUrl, parameters = {},callback) ->
		headers = 
			'auth' : 
				'user' 	: @profileConfig.api_token,
				'pass'	: 'api_token'

		# substitute parameters
		for key, value of parameters
			apiUrl = apiUrl.replace key , value

		console.log @apiConfig.host + apiUrl
		request.get @apiConfig.host + apiUrl , headers, (error, response, body) =>
			if error or response.statusCode isnt 200
				callback {}
			else
				callback JSON.parse body

	getClientList : () ->
		parameters = {':workspace_id' : @profileConfig.workspace_id};
		@_doRequest @apiConfig.clients , parameters , (result) =>
			console.log result
			callback result

	getProjectList : (callback) ->
		parameters = {':workspace_id' : @profileConfig.workspace_id};
		@_doRequest @apiConfig.projects , parameters,  (result) => 
			if Object.keys(result).length == 0
				callback result
			else 
				projects = []
				for project in result
					newProject = 
						id 			: project.id 
						name 		: project.name
						client_id	: project.cid
					projects.push newProject
				callback projects


module.exports.TogglClient = TogglClient;

	

