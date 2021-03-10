const path = require('path');

const docsify = require('../docsify');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');
const releases = require('../releases');

module.exports = (() => {
	function initDocs() {
		return ProjectMeta.getMeta().then((meta) => {
			const executionPath = process.cwd();
			const docsFolder = path.resolve(executionPath, 'docs');
			
			docsify.initialize(docsFolder, meta);
			releases.generateReleaseNotes(docsFolder);
		});
	}
	
	return initDocs;
})();