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

		requestUrl = @apiConfig.host + apiUrl
		requestUrl += '?' + querystring.stringify parameters if parameters

		console.log 'requesting '+ requestUrl

		request.get requestUrl, headers, (error, response, body) =>
			if error
				console.log error
			console.log body
			if error or response.statusCode isnt 200
				console.log error
				callback {}
			else
				callback JSON.parse body

	getClientList : () ->
		@_doRequest (@apiConfig.clients.replace ':workspace_id', @profileConfig.workspace_id) , {} , (result) =>
			console.log result
			callback result

	getProjectList : (callback) ->
		if !callback
			throw new Error 'MISSING_PARAMETER'
		if typeof callback isnt 'function'
			throw new TypeError 'INVALID_CALLBACK'

		@_doRequest (@apiConfig.projects.replace ':workspace_id', @profileConfig.workspace_id) , {},  (result) => 
			console.log result
			if Object.keys(result).length == 0
				callback {}
			else 
				projects = []
				for project in result
					newProject = 
						id 			: project.id 
						name 		: project.name
						client_id	: project.cid
					projects.push newProject
				callback projects

	getProjectTimeEntries : (projectId, startDateString, endDateString, callback) ->
		if !projectId or !callback
			throw new Error 'MISSING_PARAMETER'
		if isNaN(parseInt(projectId))
			throw new TypeError 'INVALID_PROJECTID'
		if typeof callback isnt 'function'
			throw new TypeError 'INVALID_CALLBACK'
		if startDateString or endDateString
			throw new TypeError 'INVALID START END DATE'

		startDate = new Date startDateString
		endDate = new Date endDateString

		parameters = 
			workspace_id	: @profileConfig.workspace_id
			user_agent 		: @profileConfig.user_agent
			project_ids 	: projectId
			since 			: startDate if startDate
			until 			: endDate if endDate

		@_doRequest @apiConfig.detailedReport , parameters , (result) =>
			if Object.keys(result).length == 0
				callback {}
			else 
				entries = result.data
				newEntries = []
				for entry in entries
					entryStart 	= new Date(entry.start) if entry.start
					entryEnd 	= new Date(entry.end) 	if entry.end
					newEntry = 
						id 				: entry.id
						description 	: entry.description
						start 			: entryStart
						end 			: entryEnd
						pid 			: entry.pid
						tags 			: entry.tags
					newEntries.push newEntry
				callback newEntries



module.exports.TogglClient = TogglClient;

	

