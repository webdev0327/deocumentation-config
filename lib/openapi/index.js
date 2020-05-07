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

	const apiSidebar =
		'<!-- api_open -->\n* [API Reference](/content/api_reference)\n\t* [Components](/content/api/components)\n\t* [Paths](/content/api/paths)\n<!-- api_close -->';

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
					fs.writeFileSync(path.resolve(docsFolder, 'content', 'api_reference.md'), output);
				});

			const getPaths = openAPI2md
				.render({
					data: templateData,
					separators: true,
					template: '{{>main-only-paths}}'
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(docsFolder, 'content', 'api', 'paths.md'), output);
				});

			const getComponents = openAPI2md
				.render({
					data: templateData,
					separators: true,
					template: '{{>main-only-components}}'
				})
				.then((output) => {
					fs.writeFileSync(path.resolve(docsFolder, 'content', 'api', 'components.md'), output);
				});

			promises.push(getLanding, getPaths, getComponents);

			const sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();

			const sidebarAPIFolder = sidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebar);

			try {
				fs.writeFileSync(path.resolve(docsFolder, 'content', 'api', '_sidebar.md'), sidebarAPIFolder);

				fs.copyFileSync(openAPIPath, path.resolve(docsFolder, 'static', 'openapi.yaml'));
			} catch (e) {
				console.error(e);
			}

			return Promise.all(promises);
		})
		.catch((err) => {
			return err;
		});
}

module.exports = {
	getOpenAPIOutput: generateDocumentation
};
