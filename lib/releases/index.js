const chalk = require('chalk');
const compareVersions = require('compare-versions');
const fs = require('fs');

const templates = require('../templates');

/**
 * Generates release_notes.md file from all release notes inside the releases folder
 *
 * @param {String} releasesNotePath - a path to the release_notes.md file
 * @param {String} releasesFolder - a path to the folder with release notes.
 * 
 * @return {Promise}
 */
function generateReleaseNotes(releasesNotePath, releasesFolder) {
	return Promise.resolve({}).then((context) => {
		context.releaseNotes = [];
		
		try {
			console.info(chalk.grey(`Scanning ${releasesFolder} for release notes.`));
			const releaseFiles = fs.readdirSync(releasesFolder);
			context.releaseNotes = releaseFiles
				.filter((file) => file !== '_sidebar.md')
				.map((file) => file.replace('.md', ''))
				.sort(compareVersions)
				.reverse();
			
		} catch (err) {
			return Promise.reject(`Unable to scan directory [ ${releasesFolder} ]: ${err}`);
		}
		
		return context;
	}).then((context) => {
		context.releasesTemplate = '';

		context.releaseNotes.forEach((file) => {
			const release = fs.readFileSync(`${releasesFolder}/${file}.md`).toString();
			if (release) {
				context.releasesTemplate += `\n## ${file}\n${release}\n`;
			}
		});
		
		context.releases = templates.compilePartial('{{>releases_notes}}', { releases: context.releasesTemplate });
		
		return context;
	}).then((context) => {
		try {
			fs.writeFileSync(releasesNotePath, context.releases);
		} catch (err) {
			return Promise.reject(err);
		}
		
		return true;
	});
}

module.exports = {
	generateReleaseNotes
};
