require_helper = require './require_helper'
togglClientClass = require_helper('../lib/index').TogglClient;


class Billing
	
	constructor : (billingConfig) ->
		billingConfig = JSON.parse billingConfig

		if !billingConfig or !billingConfig.salaryPerCall or !billingConfig.salaryPerHour
			throw new Error 'MISSING_PARAMETER'
		if isNaN(parseInt(billingConfig.salaryPerHour)) or isNaN(parseInt(billingConfig.salaryPerCall))
			throw new TypeError 'SALARY IS NOT A NUMBER'

		@billingConfig = billingConfig

	computeBillableHours : (projectId, timeEntries) ->
		if !projectId or !timeEntries
			throw new Error 'MISSING_PARAMETER'

		if timeEntries.length is 0
			result = 
				total 		: 0
				totalHour	: 0
				totalCalls	: 0
			return result
			
		days = {}
		totalDuration = 0
		format = 'yyyy-MM-dd'

		for timeEntry in timeEntries
			totalDuration += timeEntry.duration
			date = timeEntry.start
			dateToString =+ (date.getYear() + 1990) + '-' + (date.getMonth() + 1) + '-' + date.getDate() 
			days[dateToString] = (days[dateToString] or 0) + 1
		totalHour = totalDuration/3600
		totalBilling =
			total 		: totalHour*@billingConfig.salaryPerHour + (Object.keys(days).length)*@billingConfig.salaryPerCall
			totalHour	: totalHour
			totalCalls	: (Object.keys(days).length)

module.exports.Billing = Billing;


