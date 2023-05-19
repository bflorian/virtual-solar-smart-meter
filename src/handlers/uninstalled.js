/**
 * Handler for the uninstalled event. You can use this to clean up any data associated with the
 * installed app instance that is being uninstalled.
 * @param context - SmartApp context object that encapsulates installed app ID. Calls to the SmartThings API are not
 * supported in this handler, because the installed app record has been deleted. However, you can still make calls to
 * your own backend services.
 * @returns {Promise<void>}
 */
module.exports = async (context) => {
	console.log(`Uninstalled: ${context.installedAppId}`)
}
