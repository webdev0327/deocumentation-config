module.exports = (() => {
	class Options {
		constructor() {
			this.projectName = null;
			this.docsFolder = null;
			this.jsdocPath = null;
			this.openApiPath = null;
			this.tryMe = false;
			this.name = null;
		}
	}
	
	return Options;
})();