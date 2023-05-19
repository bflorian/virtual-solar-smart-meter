const {findTimeZone, getZonedTime} = require('timezone-support')

/**
 * Returns a scaling factor based on the time of day
 * @param date - The date/time to use in selecting the scaling factor.
 * @param timeZone - The time zone of the location.
 * @returns {number}
 */
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

/**
 * Generate a pseudo-random value for the house power consumption based on the time of day.
 * @param date - The date/time to generate the power consumption for.
 * @param timeZone - The time zone of the location.
 * @param max - The maximum power consumption of the home
 * @returns {number}
 */
module.exports.housePower = function(date, timeZone, max) {
	const min = Math.min(Math.round(max / 2), 300)
	const power = Math.floor(Math.random() * (max - min + 1)) + min
	return Math.round(timeOfDayFactor(date, timeZone) * power)
}
