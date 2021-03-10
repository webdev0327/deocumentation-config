const chalk = require('chalk');

const Cache = require('../common/cache');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');

module.exports = (() => {
	const cache = new Cache();
	
	async function clearCacheCommand(args) {
		if (args.all) {
			cache.clear();
			console.info(chalk.greenBright('Cache was cleared'));
		} else {
			const executionPath = process.cwd();
			
			const meta = await ProjectMeta.getMeta(executionPath);

			cache.delete(meta.name);
			console.info(chalk.greenBright(`Cache was cleared for package [ ${meta.name} ]`));
		}
	}
	
	return clearCacheCommand;
})();