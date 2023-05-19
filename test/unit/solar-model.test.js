const {solarPower} = require('../../src/lib/solar-model')

test('solar power now', () => {
	const power = solarPower(new Date(), 'America/New_York')
	console.log(power)
	expect(power).toBeGreaterThan(0)
});
