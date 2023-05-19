module.exports = async (context, page, _) => {
	page.section('intro', section => {
		section
			.numberSetting('period')
			.required(true)
			.defaultValue(15)
			.required(true)
			.postMessage()

		section
			.numberSetting('maxHousePower')
			.required(true)
			.defaultValue(3600)
			.required(true)
			.postMessage()

		section
			.numberSetting('maxSolarPower')
			.required(true)
			.defaultValue(7500)
			.required(true)
			.postMessage()

		section
			.enumSetting('timeZone')
			.required(true)
			.translateOptions(false)
			.options([
				'America/Los_Angeles',
				'America/Denver',
				'America/Chicago',
				'America/New_York',
				'Asia/Seoul',
				'Asia/Tokyo',
				'Asia/Hong_Kong',
				'Asia/Singapore',
				'Europe/London',
				'Europe/Paris',
				'Europe/Moscow',
				'Australia/Sydney',
				'Australia/Perth',
				'Australia/Adelaide',
				'Pacific/Honolulu',
			])
			.defaultValue('America/New_York')
	})
}
