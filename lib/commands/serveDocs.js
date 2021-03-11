const path = require('path');

const docsify = require('../docsify');

module.exports = (() => {
	const executionPath = process.cwd();
	const docsFolder = path.resolve(executionPath, 'docs');
	
	function serveDocs() {
		docsify.serve(docsFolder);
	}
	
	return serveDocs;
})();