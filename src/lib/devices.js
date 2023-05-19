const POWER_METER_PROFILE = process.env.POWER_METER_PROFILE
const SOLAR_PANEL_PROFILE = process.env.SOLAR_PANEL_PROFILE

/**
 * Returns the home power meter device
 * @param context
 * @param create
 * @returns {Promise<Device>}
 */
module.exports.getPowerMeter = async (context, create = false) => {
	// Constrain devices to those created by this app
	const devices = await context.api.devices.list({installedAppId: context.installedAppId})

	// Look for a device with the power meter profile
	let device = devices.find(device => device.profile.id === POWER_METER_PROFILE)

	// If no device is found and create is true, create a new device and initialize it
	if (!device && create) {
		device = await context.api.devices.create({
			label: 'House Power Meter',
			profileId: POWER_METER_PROFILE
		})

		await context.api.devices.createEvents(
			device.deviceId,
			[
				{
					component: 'main',
					capability: 'powerMeter',
					attribute: 'power',
					value: 0,
					unit: 'W'
				},
				{
					component: 'main',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				},
				{
					component: 'main',
					capability: 'powerConsumptionReport',
					attribute: 'powerConsumption',
					value: {
						energy: 0
					}
				},
				{
					component: 'component1',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				},
				{
					component: 'component1',
					capability: 'powerConsumptionReport',
					attribute: 'powerConsumption',
					value: {
						energy: 0
					}
				},
				{
					component: 'component2',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				},
				{
					component: 'component2',
					capability: 'powerConsumptionReport',
					attribute: 'powerConsumption',
					value: {
						energy: 0
					}
				},
				{
					component: 'main',
					capability: 'rivertalent14263.energyMeterProperties',
					attribute: 'hasFromGrid',
					value: true,
				},
				{
					component: 'main',
					capability: 'rivertalent14263.energyMeterProperties',
					attribute: 'hasToGrid',
					value: true,
				},
				{
					component: 'main',
					capability: 'rivertalent14263.energyMeterProperties',
					attribute: 'hasTodayUsage',
					value: true,
				},
				{
					component: 'main',
					capability: 'rivertalent14263.energyMeterProperties',
					attribute: 'hasTotalUsage',
					value: true,
				},
				{
					component: 'main',
					capability: 'rivertalent14263.energyMeterProperties',
					attribute: 'measureInterval',
					value: context.configNumberValue('period'),
				}
			]
		)
	}
	return device
}

/**
 * Returns the solar panel device
 * @param context
 * @param create
 * @returns {Promise<Device>}
 */
module.exports.getSolarPanel = async (context, create = false) => {
	// Constrain devices to those created by this app
	const devices = await context.api.devices.list({installedAppId: context.installedAppId})

	// Look for a device with the solar panel profile
	let device = devices.find(device => device.profile.id === SOLAR_PANEL_PROFILE)

	// If no device is found and create is true, create a new device and initialize it
	if (!device && create) {
		device = await context.api.devices.create({
			label: 'Solar Panel',
			profileId: SOLAR_PANEL_PROFILE
		})

		await context.api.devices.createEvents(
			device.deviceId,
			[
				{
					component: 'main',
					capability: 'powerMeter',
					attribute: 'power',
					value: 0,
					unit: 'W'
				},
				{
					component: 'main',
					capability: 'energyMeter',
					attribute: 'energy',
					value: 0,
					unit: 'kWh'
				},
				{
					component: 'main',
					capability: 'powerConsumptionReport',
					attribute: 'powerConsumption',
					value: {
						energy: 0
					}
				}
			]
		)
	}
	return device
}
