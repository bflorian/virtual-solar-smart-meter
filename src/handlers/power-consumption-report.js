const {housePower} = require('../lib/house-model')
const {solarPower} = require('../lib/solar-model')
const {getPowerMeter, getSolarPanel} = require('../lib/devices')

module.exports = async (context, _) => {
	const periodMinutes = context.configNumberValue('period')
	const end = new Date()
	const start = new Date(end.getTime() - (periodMinutes * 60 * 1000))
	const mid = new Date(Math.round((end.getTime() + start.getTime()) / 2))
	const timeZone = context.configStringValue('timeZone')
	const houseWatts = housePower(mid, timeZone)
	const solarWatts = solarPower(mid, timeZone)
	const fromGridWatts = Math.max(houseWatts - solarWatts, 0)
	const toGridWatts = Math.max(solarWatts - houseWatts, 0);

	const houseDeltaEnergy = Math.round(houseWatts * periodMinutes / 60);
	const solarDeltaEnergy = Math.round(solarWatts * periodMinutes / 60);
	const fromGridDeltaEnergy = Math.round(fromGridWatts * periodMinutes / 60)
	const toGridDeltaEnergy = Math.round(toGridWatts * periodMinutes / 60)

	const [powerMeter, solarPanel] = await Promise.all([
		getPowerMeter(context),
		getSolarPanel(context)
	])

	const [powerMeterStatus, solarPanelStatus] = await Promise.all([
		context.api.devices.getStatus(powerMeter.deviceId),
		context.api.devices.getStatus(solarPanel.deviceId)
	])

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

	await Promise.all([
		context.api.devices.createEvents(powerMeter.deviceId, powerMeterEvents),
		context.api.devices.createEvents(solarPanel.deviceId, solarPanelEvents)
	])
}

