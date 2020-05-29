const SwaggerParser = require('swagger-parser');

const dmd = require('./dmd');
const DmdOptions = require('./dmd-options');
const OpenAPIOptions = require('./openapi-options');

class OpenAPIToMarkdown {
	render(options) {
		options = options || {};
		const dmdOptions = new DmdOptions(options);
		if (options.data) {
			return dmd(options.data, dmdOptions);
		} else {
			return this.getOpenAPIData(options).then((templateData) => dmd(templateData, dmdOptions));
		}
	}

	getOpenAPIData(options) {
		const openAPIOptions = new OpenAPIOptions(options);
		const swaggerParser = new SwaggerParser();

		if (!openAPIOptions.file) {
			throw new Error('File option required');
		}

		return swaggerParser.validate(openAPIOptions.file).then(() => {
			return swaggerParser.parse(openAPIOptions.file);
		});
	}
}

module.exports = new OpenAPIToMarkdown();
