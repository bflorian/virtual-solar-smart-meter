const smartApp = require('./smartapp')

module.exports.handle = async (event, context, callback) => {
	await smartApp.handleLambdaCallback(event, context, callback)
}

