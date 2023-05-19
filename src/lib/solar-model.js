const {findTimeZone, getZonedTime} = require('timezone-support')

// Solar data indexed by 15 minute local time since midnight intervals
// const solarData0 = [
// 	19,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
// 	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
// 	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
// 	0,    0,    0,    8,   72,  242,  302,  442,  768, 1066, 1494, 2079,
// 	1222, 1171, 1257, 1574, 2085, 2494, 2615, 3357, 4514, 5200, 5539, 5598,
// 	5918, 6011, 6494, 6838, 6902, 6856, 7038, 7071, 7037, 7143, 5776, 4133,
// 	2596, 3222, 2106, 2294, 2209, 2099, 2412, 2644, 2061, 2044, 2064, 1919,
// 	1514, 1505, 1160,  837,  635,  607,  444,  433,  323,  242,  124,   38
// ];
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

const maximum = solarData.reduce((max, it) => {max = Math.max(max, it); return max},0)

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
