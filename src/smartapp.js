const SmartApp = require('@smartthings/smartapp')
const page1Handler = require('./handlers/page1')
const updatedHandler = require('./handlers/updated')
const uninstalledHandler = require('./handlers/uninstalled')
const powerConsumptionReportHandler = require('./handlers/power-consumption-report')
const monthlyResetHandler = require('./handlers/monthly-reset')

const APP_ID = process.env.APP_ID

/**
 * Instantiate and configure the SmartApp connector
 * @type {SmartApp}
 */
module.exports = new SmartApp()
	.appId(APP_ID)
	.enableEventLogging()
	.disableCustomDisplayName()
	.configureI18n({updateFiles: false})
	.permissions(['i:deviceprofiles:*', 'r:devices:*'])
	.page('page1', page1Handler)
	.updated(updatedHandler)
	.uninstalled(uninstalledHandler)
	.scheduledEventHandler('periodic', powerConsumptionReportHandler)
	.scheduledEventHandler('monthly', monthlyResetHandler)
