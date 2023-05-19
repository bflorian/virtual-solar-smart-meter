const {findTimeZone, getZonedTime} = require('timezone-support')

function timeOfDayFactor(date, timeZone) {
	const localTime = getZonedTime(date, findTimeZone(timeZone))
	const hour = localTime.hours
	if (hour >= 6 && hour < 12) {
		return 0.8
	} else if (hour >= 12 && hour < 18) {
		return 1.2
	} else if (hour >= 18 && hour < 24) {
		return 1.5
	} else {
		return 0.6
	}
}

module.exports.housePower = function(date, timeZone) {
	const min = 300
	const max = 3600
	const power = Math.floor(Math.random() * (max - min + 1)) + min
	return Math.round(timeOfDayFactor(date, timeZone) * power)
}
