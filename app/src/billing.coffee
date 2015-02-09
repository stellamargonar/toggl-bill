require_helper = require './require_helper'
togglClientClass = require_helper('../lib/index').TogglClient;


class Billing
	
	constructor : (billingConfig) ->
		@billingConfig = billingConfig

	computeBillableHours : (projectId, ) ->



