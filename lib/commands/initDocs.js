const path = require('path');

const docsify = require('../docsify');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');
const releases = require('../releases');

module.exports = (() => {
	function initDocs() {
		const executionPath = process.cwd();
		const docsFolder = path.resolve(executionPath, 'docs');
		
		return ProjectMeta.getMeta(executionPath).then((meta) => {
			docsify.initialize(docsFolder, meta);
			releases.generateReleaseNotes(docsFolder);
		});
	}
	
	return initDocs;
})();