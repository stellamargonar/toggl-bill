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
			if error then console.log error
			
			if error or response.statusCode isnt 200
				callback {error: error}
			else
				callback {result: JSON.parse body}

	getClientList : () ->
		@_doRequest (@apiConfig.clients.replace ':workspace_id', @profileConfig.workspace_id) , {} , (result) =>
			callback result.result

	getProjectList : (callback) ->
		#TODO retrieve also CLIENT NAME
		if !callback
			throw new Error 'MISSING_PARAMETER'
		if typeof callback isnt 'function'
			throw new TypeError 'INVALID_CALLBACK'

		@_doRequest (@apiConfig.projects.replace ':workspace_id', @profileConfig.workspace_id) , {},  (result) => 
			if !result.result
				result
			else 
				projects = []
				for project in result.result
					newProject = 
						id 			: project.id 
						name 		: project.name
						client_id	: project.cid
					projects.push newProject
				callback {result: projects}

	getProjectTimeEntries : (projectId, startDateString, endDateString, callback) ->
		if !projectId or !callback
			throw new Error 'MISSING_PARAMETER'
		if isNaN(parseInt(projectId))
			throw new TypeError 'INVALID_PROJECTID'
		if typeof callback isnt 'function'
			throw new TypeError 'INVALID_CALLBACK'
		if !startDateString or !endDateString
			throw new TypeError 'INVALID START END DATE'


		startDate = new Date parseInt(startDateString)
		endDate = new Date parseInt(endDateString)

		parameters = 
			workspace_id	: @profileConfig.workspace_id
			user_agent 		: @profileConfig.user_agent
			project_ids 	: projectId
			since 			: startDate.toISOString() if startDate
			until 			: endDate.toISOString() if endDate

		console.log parameters

		@_doRequest @apiConfig.detailedReport , parameters , (result) =>
			if !result.result
				callback result
			else 
				entries = result.result.data
				newEntries = []
				for entry in entries
					entryStart 	= new Date(entry.start) if entry.start
					entryEnd 	= new Date(entry.end) 	if entry.end
					duration = (entryEnd - entryStart)/1000

					newEntry = 
						id 				: entry.id
						description 	: entry.description
						start 			: entryStart
						end 			: entryEnd
						pid 			: entry.pid
						tags 			: entry.tags
						duration		: duration
					newEntries.push newEntry
				callback {result: newEntries}



module.exports.TogglClient = TogglClient;

	

