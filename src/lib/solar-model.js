const {findTimeZone, getZonedTime} = require('timezone-support')

// Solar data indexed by 15 minute local time since midnight intervals
const solarData = [
	0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,   26,  107,  208,  345,  513,  734,  987, 1266,
	1531, 1849, 2259, 2662, 3124, 3562, 4023, 4564, 5044, 5486, 6022, 6311,
	6636, 6880, 6893, 6599, 7348, 6427, 7233, 7630, 6660, 6456, 7405, 6278,
	6534, 6805, 6925, 6683, 6283, 5770, 5206, 5527, 4785, 4786, 3055, 3897,
	3199, 2227, 2370, 1579, 1291,  964,  698,  508,  368,  257,  159,   83,
	2,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,
];

// Maximum value in the solar data
const maximum = solarData.reduce((max, it) => {max = Math.max(max, it); return max},0)

/**
 * Calculate the solar power production for the given date and time zone.
 * @param date - The date/time to generate the power production for.
 * @param timeZone - The time zone of the location.
 * @param maxPower - The maximum power production of the solar panels.
 * @returns {number}
 */
module.exports.solarPower = function(date, timeZone, maxPower) {

	const t = getZonedTime(date, findTimeZone(timeZone))
	const offset = (t.hours * 3600) + (t.minutes * 60) + t.seconds
	const index1 = Math.floor(offset / 900);
	let power = solarData[solarData.length - 1];
	if (index1 < solarData.length) {
		const value1 = solarData[index1];
		const value2 = index1 + 1 < solarData.length ? solarData[index1 + 1] : value1;
		power = Math.round((value1 + value2) / 2);
	}
	return Math.round(maxPower * power / maximum)
}
