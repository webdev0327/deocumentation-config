const path = require('path');
const swaggerUIPath = require('swagger-ui-dist').getAbsoluteFSPath();

const fs = require('../fsSafe');
const openAPI2md = require('./openapi2md');
const templates = require('../templates');

/**
 * Generates documentation from OpenAPI file
 *
 * @param {String} openAPIPath - a path to the OpenAPI file
 * @param {String} docsFolder - a path to the docs folder
 * @param {Object} options - options for the OpenAPI generator
 * @returns {Promise<never>|Promise<T>}
 */
function generateDocumentation(openAPIPath, docsFolder, options) {
	if (!openAPIPath || !docsFolder) {
		return Promise.reject('OpenAPI or Docs folder not found');
	}

	// Defines paths for directories
	const contentDir = path.resolve(docsFolder, 'content');
	const apiDir = path.resolve(contentDir, 'api');
	const swaggerDir = path.resolve(apiDir, 'swagger');
	// Defines sidebars
	const tryMeLink = options.tryme ? '\t* [Try Me](/content/api/try)\n' : '';
	const apiSidebar = `<!-- api_open -->\n* [API Reference](/content/api_reference)\n\t* [Components](/content/api/components)\n\t* [Paths](/content/api/paths)\n${tryMeLink}<!-- api_close -->`;

	// Gets data from a OpenAPI file
	return openAPI2md
		.getOpenAPIData({
			file: openAPIPath
		})
		.then((templateData) => {
			const promises = [];

			// Generates and saves api_reference.md
			const getLanding = openAPI2md
				.render({
					data: templateData,
					template: '{{>main-landing}}',
					...options
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(contentDir, 'api_reference.md'), output);
				});

			// Generates and saves paths.md
			const getPaths = openAPI2md
				.render({
					data: templateData,
					template: '{{>main-only-paths}}',
					...options
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(apiDir, 'paths.md'), output);
				});

			// Generates and saves components.md
			const getComponents = openAPI2md
				.render({
					data: templateData,
					template: '{{>main-only-components}}',
					...options
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(apiDir, 'components.md'), output);
				});

			promises.push(getLanding, getPaths, getComponents);

			const sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();
			const sidebarAPIFolder = sidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebar);
			const openApiFilename = `${options.filename}.${options.fileExtension}`;

			fs.writeFileSync(path.resolve(apiDir, '_sidebar.md'), sidebarAPIFolder);
			fs.copyFileSync(openAPIPath, path.resolve(docsFolder, 'static', openApiFilename));

			if (options.tryme) {
				const swaggerHtml = templates.compilePartial('{{>swaggerhtml}}', { filename: openApiFilename });
				const tryMD = templates.compilePartial('{{>trymd}}');
				const swaggerCss = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui.css'));
				const swaggerJS = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui-bundle.js'));
				fs.writeFileSync(path.join(swaggerDir, 'swagger-ui.css'), swaggerCss);
				fs.writeFileSync(path.join(swaggerDir, 'swagger-ui-bundle.js'), swaggerJS);
				fs.writeFileSync(path.join(swaggerDir, 'swagger.html'), swaggerHtml);
				fs.writeFileSync(path.join(apiDir, 'try.md'), tryMD);
			}

			return Promise.all(promises);
		})
		.catch((err) => {
			return err;
		});
}

module.exports = {
	generateDocumentation
};
