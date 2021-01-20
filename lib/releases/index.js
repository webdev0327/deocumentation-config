const chalk = require('chalk');
const compareVersions = require('compare-versions');
const fs = require('fs');
const path = require('path');

const templates = require('../templates');

/**
 * Generates release_notes.md file from all release notes inside the releases folder
 *
 * @param {String} docsFolder - a path to the docs folder
 */
function generateReleaseNotes(docsFolder) {
	const contentDir = path.resolve(docsFolder, 'content');
	const releasesDir = path.resolve(contentDir, 'releases');
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
		console.error(chalk.red(`Unable to scan directory [ ${releasesDir} ]: ${e}`));
	}

	releaseNotes.forEach((file) => {
		const release = fs.readFileSync(`${releasesDir}/${file}.md`).toString();
		if (release) {
			releasesTemplate += `\n## ${file}\n${release}\n`;
		}
	});

	const releases = templates.compilePartial('{{>releases_notes}}', { releases: releasesTemplate });

	try {
		fs.writeFileSync(path.resolve(contentDir, 'release_notes.md'), releases);
	} catch (e) {
		console.error(chalk.red(e));
	}
}

module.exports = {
	generateReleaseNotes
};
