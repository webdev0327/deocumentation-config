const path = require('path');
const fs = require('../fsSafe');
const jsdoc2md = require('jsdoc-to-markdown');

/**
 * Returns a path to the file
 *
 * @param {String} path - a path to the file
 * @returns {String} a path to the file
 */
function preparePathForDocs(path) {
	return `/content/sdk/${path}`.toLocaleLowerCase();
}

/**
 * Returns a link to the file
 *
 * @param {String} path - a path to the file
 * @param {Boolean} [tab] - adds tabulation
 * @returns {string}
 */
function prepareLinkForDocs(path, tab) {
	const name = path.replace(/-/g, '/');

	return `${tab ? '\t' : ''}* [${name}](${preparePathForDocs(path)})\n`;
}

/**
 * Generates a documentation from JSDoc
 *
 * @param {Object} meta - an object with meta data
 * @param {String} meta.packageName - a name of the package
 * @param {String} meta.docsFolder - a path to the docs folder
 * @param {String} meta.srcPath - a path to the source code
 * @returns {Promise}
 */
function generateDocs(meta) {
	global.packageName = meta.packageName;

	const contentDir = path.resolve(meta.docsFolder, 'content');
	const sdkDir = path.resolve(contentDir, 'sdk');
	const template = `{{>main}}`;

	let sdkReference = '# SDK Reference\n';
	let sdkSidebar = '<!-- sdk_open -->\n* [SDK Reference](/content/sdk_reference)\n';

	return jsdoc2md.clear().then(() => {
		return jsdoc2md
			.getTemplateData({
				files: path.resolve(meta.srcPath, '**', '*.js')
			})
			.then((templateData) => {
				return templateData.reduce(
					(templateGroups, identifier) => {
						if (!identifier.meta && identifier.kind === 'constructor') {
							templateGroups.constructors[identifier.memberof] = identifier;

							return templateGroups;
						}

						const templatePath = identifier.meta.path;
						const srcPath = meta.srcPath.split('/');
						const folder = srcPath[srcPath.length - 1];
						const arrayFilePath = templatePath.split(folder);
						const filePath = `${folder}` + arrayFilePath[1].replace(/\//g, '-');

						if (!templateGroups.dataByPath[filePath]) {
							templateGroups.dataByPath[filePath] = [];
						}

						templateGroups.dataByPath[filePath].push(identifier);
						if (!identifier.ignore) {
							templateGroups.pathById[identifier.id] = preparePathForDocs(filePath).toLocaleLowerCase();
						}

						return templateGroups;
					},
					{ dataByPath: {}, pathById: {}, constructors: {} }
				);
			})
			.then((templateGroups) => {
				Object.keys(templateGroups.constructors).forEach((key) => {
					const constructor = templateGroups.constructors[key];
					Object.keys(templateGroups.dataByPath).forEach((p) => {
						const list = [];

						templateGroups.dataByPath[p].forEach((identifier) => {
							if (identifier.id === key) {
								constructor.meta = identifier.meta;
								constructor.scope = 'constructor';
								list.push(constructor);
							}
						});

						templateGroups.dataByPath[p] = templateGroups.dataByPath[p].concat(list);
					});
				});

				return templateGroups;
			})
			.then((templateGroups) => {
				global.pathById = templateGroups.pathById;

				const keys = Object.keys(templateGroups.dataByPath).sort();
				keys.forEach((filePath) => {
					const data = templateGroups.dataByPath[filePath];

					const output = jsdoc2md.renderSync({
						data: data,
						template,
						separators: true,
						plugin: `${path.resolve(__dirname, '../../node_modules/@barchart/dmd-plugin')}`,
						'global-index-format': 'md'
					});

					if (output) {
						sdkReference += prepareLinkForDocs(filePath);
						sdkSidebar += prepareLinkForDocs(filePath, true);
						fs.writeFileSync(path.resolve(sdkDir, `${filePath.toLowerCase()}.md`), output);
					}
				});

				sdkSidebar += '<!-- sdk_close -->';

				fs.writeFileSync(path.resolve(contentDir, `sdk_reference.md`), sdkReference);

				const sidebar = fs.readFileSync(path.resolve(meta.docsFolder, '_sidebar.md')).toString();

				const sidebarSDKFolder = sidebar.replace(
					/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm,
					sdkSidebar
				);

				fs.writeFileSync(path.resolve(sdkDir, '_sidebar.md'), sidebarSDKFolder);
			});
	});
}

module.exports = {
	generateDocs
};
