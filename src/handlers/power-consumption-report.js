const {housePower} = require('../lib/house-model')
const {solarPower} = require('../lib/solar-model')
const {getPowerMeter, getSolarPanel} = require('../lib/devices')

/**
 * Send events for the power consumption and energy usage for the house, solar panels, and grid. The power consumption
 * and energy usage are calculated for the period of time specified by the period configuration parameter.
 *
 * @param context - SmartApp context object that encapsulates the client for calling the SmartThings API.
 * @param _ The scheduled event object (unused)
 * @returns {Promise<void>}
 */
module.exports = async (context, _) => {
	// Calculate the start and end times for the period of time to report on.
	const periodMinutes = context.configNumberValue('period')
	const end = new Date()
	const start = new Date(end.getTime() - (periodMinutes * 60 * 1000))
	const mid = new Date(Math.round((end.getTime() + start.getTime()) / 2))

	// Retrieve the simulated house and solar panel average power for the period
	const timeZone = context.configStringValue('timeZone')
	const houseWatts = housePower(mid, timeZone, context.configNumberValue('maxHousePower'))
	const solarWatts = solarPower(mid, timeZone, context.configNumberValue('maxSolarPower'))
	const fromGridWatts = Math.max(houseWatts - solarWatts, 0)
	const toGridWatts = Math.max(solarWatts - houseWatts, 0);

	// Calculate the energy usage for the period
	const houseDeltaEnergy = Math.round(houseWatts * periodMinutes / 60);
	const solarDeltaEnergy = Math.round(solarWatts * periodMinutes / 60);
	const fromGridDeltaEnergy = Math.round(fromGridWatts * periodMinutes / 60)
	const toGridDeltaEnergy = Math.round(toGridWatts * periodMinutes / 60)

	// Get the house power and solar panel devices, which are created when the app is first installed.
	const [powerMeter, solarPanel] = await Promise.all([
		getPowerMeter(context),
		getSolarPanel(context)
	])

	// Get the current status of the power meter and solar panel devices. This call is necessary only in order to calculate
	// the monthly and total all-time energy usage. It may not be necessary if that information is provided by the
	// devices themselves.
	const [powerMeterStatus, solarPanelStatus] = await Promise.all([
		context.api.devices.getStatus(powerMeter.deviceId),
		context.api.devices.getStatus(solarPanel.deviceId)
	])

	// The house power meter events, with energyMeter and powerConsumptionReport events for the house and grid, as well
	// as the powerMeter event for the house.
	const powerMeterEvents = [
		{
			component: 'main',
			capability: 'powerMeter',
			attribute: 'power',
			value: houseWatts,
			unit: 'W'
		},
		{
			component: 'main',
			capability: 'energyMeter',
			attribute: 'energy',
			value: powerMeterStatus.components.main.energyMeter.energy.value + (fromGridDeltaEnergy / 1000),
			unit: 'kWh'
		},
		{
			component: 'main',
			capability: 'powerConsumptionReport',
			attribute: 'powerConsumption',
			value: {
				power: fromGridWatts,
				energy: powerMeterStatus.components.main.powerConsumptionReport.powerConsumption.value.energy + fromGridDeltaEnergy,
				deltaEnergy: fromGridDeltaEnergy,
				start: start.toISOString(),
				end: end.toISOString()
			}
		},
		{
			component: 'component1',
			capability: 'energyMeter',
			attribute: 'energy',
			value: powerMeterStatus.components.component1.energyMeter.energy.value + (toGridDeltaEnergy / 1000),
			unit: 'kWh'
		},
		{
			component: 'component1',
			capability: 'powerConsumptionReport',
			attribute: 'powerConsumption',
			value: {
				power:toGridWatts,
				energy: powerMeterStatus.components.component1.powerConsumptionReport.powerConsumption.value.energy + toGridDeltaEnergy,
				deltaEnergy: toGridDeltaEnergy,
				start: start.toISOString(),
				end: end.toISOString()
			}
		},
		{
			component: 'component2',
			capability: 'energyMeter',
			attribute: 'energy',
			value: powerMeterStatus.components.component2.energyMeter.energy.value + (houseDeltaEnergy / 1000),
			unit: 'kWh'
		},
		{
			component: 'component2',
			capability: 'powerConsumptionReport',
			attribute: 'powerConsumption',
			value: {
				power: houseWatts,
				energy: powerMeterStatus.components.component2.powerConsumptionReport.powerConsumption.value.energy + houseDeltaEnergy,
				deltaEnergy: houseDeltaEnergy,
				start: start.toISOString(),
				end: end.toISOString()
			}
		}
	]

	// The solar panel events, with powerMeter, energyMeter and powerConsumptionReport capabilities.
	const solarPanelEvents = [
		{
			component: 'main',
			capability: 'powerMeter',
			attribute: 'power',
			value: solarWatts,
			unit: 'W'
		},
		{
			component: 'main',
			capability: 'energyMeter',
			attribute: 'energy',
			value: solarPanelStatus.components.main.energyMeter.energy.value + (solarDeltaEnergy / 1000),
			unit: 'kWh'
		},
		{
			component: 'main',
			capability: 'powerConsumptionReport',
			attribute: 'powerConsumption',
			value: {
				power: solarWatts,
				energy: (powerMeterStatus.components.main.powerConsumptionReport ?
					powerMeterStatus.components.main.powerConsumptionReport.powerConsumption.value.energy : 0) + solarDeltaEnergy,
				deltaEnergy: solarDeltaEnergy,
				start: start.toISOString(),
				end: end.toISOString()
			}
		}
	]

	// Send the events to SmartThings
	await Promise.all([
		context.api.devices.createEvents(powerMeter.deviceId, powerMeterEvents),
		context.api.devices.createEvents(solarPanel.deviceId, solarPanelEvents)
	])

	console.log(`${end.toISOString()} - ${context.installedAppId}: houseWatts: ${houseWatts}, solarWatts: ${solarWatts}, fromGridWatts: ${fromGridWatts}, toGridWatts: ${toGridWatts}`)
}

