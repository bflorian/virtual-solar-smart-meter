const { getPowerMeter, getSolarPanel } = require('../lib/devices')

/**
 * Reset the monthly energy counters to zero at the beginning of each month. Only the Energy Meter capability
 * values are reset. The all-time energy property of the Power Consumption Report capability is not reset.
 *
 * @param context - SmartApp context object that encapsulates the client for calling the SmartThings API.
 * @param _ The scheduled event object (unused)
 * @returns {Promise<void>}
 */
module.exports = async (context, _) => {
	const [powerMeter, solarPanel] = await Promise.all([
		getPowerMeter(context),
		getSolarPanel(context)
	])

	await Promise.all([
		context.api.devices.createEvents(
			powerMeter.deviceId,
			[
				{
					component: 'main',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				}
			]
		),
		context.api.devices.createEvents(
			solarPanel.deviceId,
			[
				{
					component: 'main',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				}
			]
		)
	])
}
