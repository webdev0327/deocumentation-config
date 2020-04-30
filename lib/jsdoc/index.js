const compareVersions = require('compare-versions');
const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const templates = require('../templates');

/**
 * Returns a path to the file
 *
 * @param path
 * @returns {string}
 */
function preparePathForDocs(path) {
	return `/content/sdk/${path}`.toLocaleLowerCase();
}

/**
 * Returns a link to the file
 *
 * @param {String} path - a path to the file
 * @param {Boolean} tab - adds tabulation
 * @returns {string}
 */
function prepareLinkForDocs(path, tab) {
	const name = path.replace(/-/g, '/');

	return `${tab ? '\t' : ''}* [${name}](${preparePathForDocs(path)})\n`;
}

/**
 * Generates release_notes.md file from all release notes inside the releases folder
 *
 * @param {String} docsFolder - a path to the docs folder
 */
function generateReleaseNotes(docsFolder) {
	const contentDir = path.join(docsFolder, 'content');
	const releasesDir = path.join(contentDir, 'releases');
	let releaseNotes = [];
	let releasesTemplate = '';

	try {
		const releaseFiles = fs.readdirSync(releasesDir);
		releaseNotes = releaseFiles
			.filter((file) => file !== '_sidebar.md')
			.map((file) => file.replace('.md', ''))
			.sort(compareVersions)
			.reverse();
	} catch (e) {
		console.error(`Unable to scan directory [ ${releasesDir} ]: ${e}`);
	}

	releaseNotes.forEach((file) => {
		const release = fs.readFileSync(`${releasesDir}/${file}.md`).toString();
		if (release) {
			releasesTemplate += `\n## ${file}\n${release}\n`;
		}
	});

	const releases = templates.compilePartial('{{>releases_notes}}', { releases: releasesTemplate });

	fs.writeFileSync(path.join(contentDir, 'release_notes.md'), releases);
}

/**
 * Generates a documentation from JSDoc
 *
 * @param {Object} meta - an object with meta data
 * @param {String} meta.packageName - a name of the package
 * @param {String} meta.docsFolder - a path to the docs folder
 * @param {String} meta.srcPath - a path to the source code
 * @returns {PromiseLike<any> | Promise<T>}
 */
function generateDocs(meta) {
	global.packageName = meta.packageName;

	const contentDir = path.join(meta.docsFolder, 'content');
	const conceptsDir = path.join(contentDir, 'concepts');
	const releasesDir = path.join(contentDir, 'releases');
	const sdkDir = path.join(contentDir, 'sdk');
	const template = `{{>main}}`;

	let sdkReference = '# SDK Reference\n';
	let sdkSidebar = '<!-- sdk_open -->\n* [SDK Reference](/content/sdk_reference)\n';

	return jsdoc2md.clear().then(() => {
		return jsdoc2md
			.getTemplateData({
				files: path.join(meta.srcPath, '**', '*.js')
			})
			.then((templateData) => {
				return templateData.reduce(
					(templateGroups, identifier) => {
						if (!identifier.meta) {
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
					{ dataByPath: {}, pathById: {} }
				);
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
						plugin: '@barchart/dmd-plugin',
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

				const sidebar = fs.readFileSync(path.join(meta.docsFolder, '_sidebar.md')).toString();

				const sidebarSDKFolder = sidebar.replace(
					/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm,
					sdkSidebar
				);

				fs.writeFileSync(path.join(sdkDir, '_sidebar.md'), sidebarSDKFolder);
				fs.writeFileSync(path.join(contentDir, '_sidebar.md'), sidebar);
				fs.writeFileSync(path.join(conceptsDir, '_sidebar.md'), sidebar);
				fs.writeFileSync(path.join(releasesDir, '_sidebar.md'), sidebar);

				generateReleaseNotes(meta.docsFolder);
			});
	});
}

module.exports = {
	generateDocs
};
