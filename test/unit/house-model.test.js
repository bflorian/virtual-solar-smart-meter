const {housePower} = require('../../src/lib/house-model')

test('solar power', () => {
	const power = housePower(new Date(), 'America/New_York', 8000)
	console.log(power)
	expect(power).toBeGreaterThan(0)
});
