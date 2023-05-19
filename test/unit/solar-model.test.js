const {solarPower} = require('../../src/lib/solar-model')

test('solar power', () => {
	const power = solarPower(new Date(), 'America/New_York', 10000)
	console.log(power)
	expect(power).toBeGreaterThan(0)
});
