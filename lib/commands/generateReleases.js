const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');

const Cache = require('../common/cache');
const fs = require('../common/fsSafe');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');
const releases = require('../releases');
const templates = require('../templates');

const RELEASES = 'releases';

module.exports = (() => {
	function generateReleases(releasesFolder) {
		return Promise.resolve({}).then((context) => {
			console.info(chalk.grey('Generating release notes...'));
			context.executionPath = process.cwd();
			context.docsFolder = path.resolve(context.executionPath, 'docs');
			context.releasesFolder = path.resolve(context.docsFolder, 'content', 'releases');
			context.releaseNotesPath = path.resolve(context.docsFolder, 'content', 'release_notes.md');
			context.cache = new Cache();
			
			return ProjectMeta.getMeta(context.executionPath).then((meta) => {
				context.meta = meta;

				return context;
			});
		}).then((context) => {
			const cachedPaths = context.cache.get(context.meta.name);
			
			if (releasesFolder) {
				context.releasesFolder = path.resolve(context.executionPath, releasesFolder);
				
				return context;
			}
			
			if (cachedPaths[RELEASES]) {
				context.releasesFolder = cachedPaths[RELEASES];
				
				return context;
			}
			
			const releaseFolderQuestion = { type: 'input', name: 'releases', message: `Enter the path to release notes, [Enter] for default path (${context.executionPath}/):` };
			
			return inquirer.prompt(releaseFolderQuestion).then((answer) => {
				const releasesFolder = answer[RELEASES];
				
				if (releasesFolder) {
					context.releasesFolder = path.resolve(context.executionPath, releasesFolder);
				}

				cachedPaths[RELEASES] = context.releasesFolder;

				context.cache.add(context.meta.name, cachedPaths);
				
				return context;
			});
		}).then((context) => {
			const isReleasesExist = fs.existsSync(context.releasesFolder);
			const isReleaseNotesExist = fs.existsSync(context.releaseNotesPath);

			if (!isReleasesExist && !isReleaseNotesExist) {
				return Promise.reject(`file [ ${path.resolve(context.docsFolder, 'content', 'release_notes.md')} ] or [ ${path.resolve(context.docsFolder, 'content', 'releases')} ] folder doesn't exist`);
			}
			
			templates.registerPartials();

			return releases.generateReleaseNotes(context.releaseNotesPath, context.releasesFolder).then(() => {
				console.info(chalk.greenBright('Release notes were updated.'));
			});
		});
	}
	
	return generateReleases;
})();