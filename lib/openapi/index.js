const fs = require('fs');
const path = require('path');
const openAPI2md = require('open-api-to-markdown');

/**
 * Generates documentation from OpenAPI file
 *
 * @param {String} openAPIPath - a path to the OpenAPI file
 * @param {String} docsFolder - a path to the docs folder
 * @returns {Promise<never>|Promise<T>}
 */
function generateDocumentation(openAPIPath, docsFolder) {
	if (!openAPIPath || !docsFolder) {
		return Promise.reject('OpenAPI or Docs folder not found');
	}

	return openAPI2md
		.getOpenAPIData({
			file: openAPIPath
		})
		.then((templateData) => {
			return openAPI2md
				.render({
					data: templateData,
					separators: true
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(docsFolder, 'content', 'api.md'), output);
				});
		})
		.catch((err) => {
			return err;
		});
}

module.exports = {
	getOpenAPIOutput: generateDocumentation
};
