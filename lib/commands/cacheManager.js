const chalk = require('chalk');
const inquirer = require('inquirer');

const Cache = require('../common/cache');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');

module.exports = (() => {
	const cache = new Cache();
	
	async function clearCacheCommand() {
		const executionPath = process.cwd();

		const meta = await ProjectMeta.getMeta(executionPath);
		const cachedPaths = cache.get(meta.name);
		
		const choices = Object.entries(cachedPaths).map((obj) => {
			const name = convertPathName(obj[0]);
			
			return {
				name: `${name} Path (${obj[1]})`,
				value: obj[0]
			};
		});
		
		if (choices.length === 0) {
			console.info(chalk.yellow('The cache is empty.'));
			
			return true;
		}

		const deleteQuestion = { type: 'checkbox', name: 'cache', message: `Select the paths you want to remove from the cache (${meta.packageName})`, choices };

		return inquirer.prompt(deleteQuestion).then((answer) => {
			if (answer.cache.length === 0) {
				console.info(chalk.greenBright('Clearing the cache has been canceled.'));
				
				return true;
			}
			
			const names = answer.cache.map((name) => {
				return convertPathName(name);
			});

			const confirmQuestion = { type: 'confirm', name: 'confirm', message: `You are going to delete these paths: [ ${names.join(', ')} ] Are you sure?:` };
			
			return inquirer.prompt(confirmQuestion).then((confirmAnswer) => {
				if (!confirmAnswer.confirm) {
					console.info(chalk.greenBright('Clearing the cache has been canceled.'));
					
					return true;
				}

				const newCachePaths = { ...cachedPaths };

				answer.cache.forEach((name) => {
					delete newCachePaths[name];
				});

				cache.add(meta.name, newCachePaths);

				console.info(chalk.greenBright('The cache has been cleared.'));
				
				return true;
			});
		});
	}
	
	function convertPathName(pathName) {
		let name = pathName;

		if (name.includes('openapi')) {
			name = 'OpenAPI';
		}

		if (name.includes('releases')) {
			name = 'Releases';
		}

		if (name.includes('jsdoc')) {
			name = 'JSDoc';
		}
		
		return name;
	}
	
	return clearCacheCommand;
})();