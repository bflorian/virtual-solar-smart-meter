/**
 * Express server for local testing. Not used in the deployed AWS version
 */

require('dotenv').config();
const express    = require('express');
const smartApp   = require('./smartapp');
const PORT       = process.env.PORT || 3000;

/* Configure Express to handle JSON lifecycle event calls from SmartThings */
const server = express();
server.use(express.json());

server.post('/', async (req, res, next) => {
	try {
		await smartApp.handleHttpCallback(req, res);
	} catch (e) {
		next(e)
	}
});

/* Start listening at your defined PORT */
server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
