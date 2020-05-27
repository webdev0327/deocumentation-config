const fs = require('../fsSafe');
const path = require('path');
const swaggerUIPath = require('swagger-ui-dist').getAbsoluteFSPath();
const openAPI2md = require('../openapi2markdown');
const templates = require('../templates');

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

	const contentDir = path.resolve(docsFolder, 'content');
	const apiDir = path.resolve(contentDir, 'api');
	const swaggerDir = path.resolve(apiDir, 'swagger');

	const apiSidebar =
		'<!-- api_open -->\n* [API Reference](/content/api_reference)\n\t* [Components](/content/api/components)\n\t* [Paths](/content/api/paths)\n\t* [Swagger UI](/content/api/swagger)\n<!-- api_close -->';

	return openAPI2md
		.getOpenAPIData({
			file: openAPIPath
		})
		.then((templateData) => {
			const promises = [];

			const getLanding = openAPI2md
				.render({
					data: templateData,
					separators: true,
					template: '{{>main-landing}}'
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(contentDir, 'api_reference.md'), output);
				});

			const getPaths = openAPI2md
				.render({
					data: templateData,
					separators: true,
					template: '{{>main-only-paths}}'
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(apiDir, 'paths.md'), output);
				});

			const getComponents = openAPI2md
				.render({
					data: templateData,
					separators: true,
					template: '{{>main-only-components}}'
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(apiDir, 'components.md'), output);
				});

			promises.push(getLanding, getPaths, getComponents);

			const sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();

			const sidebarAPIFolder = sidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebar);

			fs.writeFileSync(path.resolve(apiDir, '_sidebar.md'), sidebarAPIFolder);
			fs.copyFileSync(openAPIPath, path.resolve(docsFolder, 'static', 'openapi.yaml'));

			const swaggerHtml = templates.compilePartial('{{>swaggerhtml}}', { filename: 'openapi.yaml' });
			const swaggerMD = templates.compilePartial('{{>swaggermd}}');
			const swaggerCss = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui.css'));
			const swaggerJS = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui-bundle.js'));
			fs.writeFileSync(path.join(swaggerDir, 'swagger-ui.css'), swaggerCss);
			fs.writeFileSync(path.join(swaggerDir, 'swagger-ui-bundle.js'), swaggerJS);
			fs.writeFileSync(path.join(swaggerDir, 'swagger.html'), swaggerHtml);
			fs.writeFileSync(path.join(apiDir, 'swagger.md'), swaggerMD);

			return Promise.all(promises);
		})
		.catch((err) => {
			return err;
		});
}

module.exports = {
	getOpenAPIOutput: generateDocumentation
};
