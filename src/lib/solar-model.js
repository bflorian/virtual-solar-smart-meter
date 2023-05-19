const hashSum = require('hash-sum')
const {findTimeZone, getZonedTime} = require('timezone-support')
const solarData = require('./solar-data')

// Maximum value in the solar data
const maximum = solarData.flat()
	.reduce((max, it) => {max = Math.max(max, it); return max},0)

/**
 * Calculate the solar power production for the given date and time zone.
 * @param date - The date/time to generate the power production for.
 * @param timeZone - The time zone of the location.
 * @param maxPower - The maximum power production of the solar panels.
 * @returns {number}
 */
module.exports.solarPower = function(date, timeZone, maxPower) {
	const dayIndex = parseInt(hashSum(date.toDateString()), 16) % solarData.length
	const dayData = solarData[dayIndex]
	const t = getZonedTime(date, findTimeZone(timeZone))
	const offset = (t.hours * 3600) + (t.minutes * 60) + t.seconds
	const index1 = Math.floor(offset / 900);
	let power = dayData[dayData.length - 1];
	if (index1 < dayData.length) {
		const value1 = dayData[index1];
		const value2 = index1 + 1 < dayData.length ? dayData[index1 + 1] : value1;
		power = Math.round((value1 + value2) / 2);
	}
	return Math.round(maxPower * power / maximum)
}
