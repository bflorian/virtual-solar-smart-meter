const { getPowerMeter, getSolarPanel } = require('../lib/devices')

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
