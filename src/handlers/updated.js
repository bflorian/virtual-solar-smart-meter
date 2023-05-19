const {getPowerMeter, getSolarPanel} = require('../lib/devices')

/**
 * Create the periodic and monthly schedules and initialize the power meter and solar panel devices.
 * @param context - SmartApp context object that encapsulates the client for calling the SmartThings API.
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
	const period = context.configNumberValue('period')
	const periodic = {
		name: 'periodic',
		cron: {
			expression: `0/${period} * * * ? *`,
			timezone: 'America/Los_Angeles'
		}
	}

	const monthly = {
		name: 'monthly',
		cron: {
			expression: `0 0 1 * ? *`,
			timezone: 'America/Los_Angeles'
		}
	}

	await context.api.schedules.delete()
	await Promise.all([
		context.api.schedules.create(periodic),
		context.api.schedules.create(monthly),
		getPowerMeter(context, true),
		getSolarPanel(context, true),
	])
}
