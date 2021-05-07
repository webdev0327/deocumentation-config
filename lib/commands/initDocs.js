const chalk = require('chalk');
const path = require('path');

const docsify = require('../docsify');
const generateReleases = require('./generateReleases');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');

module.exports = (() => {
	function initDocs() {
		const executionPath = process.cwd();
		const docsFolder = path.resolve(executionPath, 'docs');
		
		return ProjectMeta.getMeta(executionPath).then((meta) => {
			docsify.initialize(docsFolder, meta);
			
			return generateReleases('docs/content/releases').catch((err) => {
				chalk.red(err);
			});
		});
	}
	
	return initDocs;
})();