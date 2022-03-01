module.exports = (() => {
	/**
	 * Options contains options for the generators.
	 * @class
	 * @property {String|null} projectName - name of project
	 * @property {String|null} docsFolder - path to the docs folder
	 * @property {String|null} jsdocPath - path to the JavaScript source
	 * @property {String|null} openApiPath - path or url to the OpenAPI file
	 * @property {Boolean} tryMe - generates a try me section if true
	 * @property {Boolean} ignoreOptional - ignores optional fields for OpenAPI examples if true
	 * @property {String|null} name - name from ProjectMeta
	 * @public
	 */
	class Options {
		constructor() {
			this.projectName = null;
			this.docsFolder = null;
			this.jsdocPath = null;
			this.openApiPath = null;
			this.tryMe = false;
			this.ignoreOptional = false;
			this.name = null;
		}
	}

	return Options;
})();
