const inquirer = require('inquirer');
const path = require('path');

const exit = require('../exit/exit');
const fs = require('../fsSafe');

module.exports = (() => {
	const DEFAULT_NAME = 'Your Project Name';
	const DEFAULT_PACKAGE_NAME = 'yourprojectname';
	
	/**
	 * Gets meta data from package.json.
	 *
	 * @param {String} packagePath - Path to the package.json file
	 * @param {Boolean} throwErr - stop execution if error handled
	 * @returns {{name: string, description: *, repository: *, version: *}|undefined}
	 */
	function getMetaFromPackage(packagePath, throwErr = false) {
		const isPackageJSON = fs.existsSync(packagePath);

		if (!isPackageJSON) {
			if (throwErr) {
				exit('package.json not found');
			} else {
				return new ProjectMeta(DEFAULT_NAME, DEFAULT_PACKAGE_NAME, '', '', '');
			}
		}

		const pkg = require(packagePath);

		return new ProjectMeta(pkg.name, pkg.name, pkg.version, pkg.description, pkg.repository ? pkg.repository.url : '');
	}
	
	class ProjectMeta {
		constructor(name, packageName, version, description, repository) {
			this.name = name || '';
			this.packageName = name || '';
			this.version = version || '';
			this.description = description || '';
			this.repository = repository || '';
		}
		
		static async getMeta(executionPath) {
			let packageJSONFile = path.resolve(executionPath, 'package.json');

			let projectMeta = getMetaFromPackage(packageJSONFile);

			if (projectMeta.name === DEFAULT_NAME) {
				const answer = await inquirer.prompt({
					type: 'input',
					name: 'pkg',
					message: `Enter the path to the package.json file (${executionPath}/):`
				});

				if (!answer.pkg) {
					exit('package.json not found');
				}

				packageJSONFile = path.resolve(executionPath, answer.pkg);

				projectMeta = getMetaFromPackage(packageJSONFile, true);
			}

			return projectMeta;
		}
	}
	
	return ProjectMeta;
})();