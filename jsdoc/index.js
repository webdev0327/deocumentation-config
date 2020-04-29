const path = require('path');

function preparePathForDocs(path) {
	return `/content/sdk/${path}`.toLocaleLowerCase();
}

function prepareLinkForDocs(path, tab) {
	const name = path.replace(/-/g, '/');

	return `${tab ? '\t' : ''}* [${name}](${preparePathForDocs(path)})\n`;
}

//TODO WIP. This code doesn't work
function generateReleaseNotes(releaseNotes = []) {
	const contentDir = `${__dirname}/docs/content`;
	const releasesDir = `${contentDir}/releases`;
	let releasesTemplate = docsifyTemplates.releasesTemplate;

	try {
		const releaseFiles = fs.readdirSync(releasesDir);
		releaseNotes = releaseFiles
			.filter((file) => file !== '_sidebar.md')
			.map((file) => file.replace('.md', ''))
			.sort(compareVersions)
			.reverse();
	} catch (e) {
		console.log(`Unable to scan directory [ ${releasesDir} ]: ${e}`);
	}

	releaseNotes.forEach((file) => {
		const release = fs.readFileSync(`${releasesDir}/${file}.md`).toString();
		if (release) {
			releasesTemplate += `\n## ${file}\n${release}\n`;
		}
	});

	releasesTemplate += '\n<!-- releases_close -->';

	gulp
		.src([`${contentDir}/release_notes.md`])
		.pipe(replace(/(<!-- releases_open -->(\s|.)*<!-- releases_close -->)/gm, releasesTemplate))
		.pipe(gulp.dest(contentDir));
}

//TODO WIP. This code doesn't work
/**
 *
 * @param {Object} data
 * @param {String} data.packageName
 * @param {String} data.docsFolder
 * @param {String} data.srcPath
 * @returns {PromiseLike<any> | Promise<T>}
 */
function generateDocs(data) {
	global.packageName = data.packageName;

	const contentDir = path.join(data.docsFolder, 'content');
	const conceptsDir = path.join(contentDir, 'concepts');
	const releasesDir = path.join(contentDir, 'releases');
	const sdkDir = path.join(contentDir, 'sdk');
	const template = `{{>main}}`;

	let sdkReference = docsifyTemplates.sdkReference;
	let sdkSidebar = docsifyTemplates.sdkSidebar;

	return jsdoc2md.clear().then(() => {
		return jsdoc2md
			.getTemplateData({
				files: path.join(data.srcPath, '**', '*.js')
			})
			.then((templateData) => {
				return templateData.reduce(
					(templateGroups, identifier) => {
						if (!identifier.meta) {
							return templateGroups;
						}

						const path = identifier.meta.path;
						const arrayFilePath = path.split('lib/');
						const filePath = 'lib-' + arrayFilePath[1].replace(/\//g, '-');

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

				gulp
					.src([`${docDir}/_sidebar.md`], { allowEmpty: true })
					.pipe(replace(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm, sdkSidebar))
					.pipe(gulp.dest(sdkDir));

				gulp
					.src([`${docDir}/_sidebar.md`])
					.pipe(gulp.dest(contentDir))
					.pipe(gulp.dest(conceptsDir))
					.pipe(gulp.dest(releasesDir));

				generateReleaseNotes();
			});
	});
}

module.exports = {
	generateDocs
};
