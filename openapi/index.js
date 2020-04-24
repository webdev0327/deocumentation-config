const fs = require('fs');
const openAPI2md = require('open-api-to-markdown');

function getOpenAPIOutput(swaggerPath = 'swagger.yaml', docsFolder = process.cwd() + '/docs/README.md') {
	return openAPI2md
		.getOpenAPIData({
			file: swaggerPath
		})
		.then((templateData) => {
			return openAPI2md
				.render({
					data: templateData,
					separators: true
				})
				.then((output) => {
					fs.writeFileSync(docsFolder, output);
				});
		})
		.catch((err) => {
			console.error(err.toString());

			return err;
		});
}

module.exports = {
	getOpenAPIOutput
};
