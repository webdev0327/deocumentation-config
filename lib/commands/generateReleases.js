const chalk = require('chalk');
const path = require('path');
	
const fs = require('../common/fsSafe');
const releases = require('../releases');
const templates = require('../templates');

module.exports = (() => {
	function generateReleases() {
		const executionPath = process.cwd();
		const docsFolder = path.resolve(executionPath, 'docs');		
		
		const isReleasesExist = fs.existsSync(path.resolve(docsFolder, 'content', 'releases'));
		const isReleaseNotesExist = fs.existsSync(path.resolve(docsFolder, 'content', 'release_notes.md'));

		if (isReleasesExist && isReleaseNotesExist) {
			templates.registerPartials();
			releases.generateReleaseNotes(docsFolder);
			console.info(chalk.greenBright('Release notes was updated'));
		} else {
			console.error(chalk.red(`file [ ${path.resolve(docsFolder, 'content', 'release_notes.md')} ] or [ ${path.resolve(docsFolder, 'content', 'releases')} ] folder doesn't exist`));
		}
	}
	
	return generateReleases;
})();