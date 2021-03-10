const chalk = require('chalk');

/**
 * Closes the app and shows an error.
 * 
 * @param {String} error - Error message
 */
module.exports = function exit(error) {
	console.error(chalk.red(error));
	process.exit(1);
};