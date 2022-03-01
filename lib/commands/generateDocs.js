const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');

const Cache = require('../common/cache');
const docsify = require('../docsify');
const fs = require('../common/fsSafe');
const generateReleases = require('./generateReleases');
const JSDocGenerator = require('../generators/jsdoc/JSDocGenerator');
const OpenAPIGenerator = require('../generators/openapi/OpenAPIGenerator');
const Options = require('../common/options/Options');
const ProjectMeta = require('../common/projectMeta/ProjectMeta');

module.exports = (() => {
	const executionPath = process.cwd();
	const docsFolder = path.resolve(executionPath, 'docs');
	const cache = new Cache();

	const OPEN_API_PATH = 'openapiPath';
	const JSDOC_PATH = 'jsdocPath';

	const steps = {
		jsdoc: undefined,
		openapi: undefined
	};
	const jsdocQuestion = { type: 'input', name: JSDOC_PATH, message: `Enter the path to the JavaScript source code, [Enter] for default path (${executionPath}/):` };
	const openAPIQuestion = { type: 'input', name: OPEN_API_PATH, message: `Enter the path to the OpenAPI file (${executionPath}/):` };

	async function generateDocs(args) {
		const questions = [];
		const sourcePaths = {
			[JSDOC_PATH]: null,
			[OPEN_API_PATH]: null
		};

		const meta = await ProjectMeta.getMeta(executionPath);
		const cachedPaths = cache.get(meta.name);
		const options = new Options();

		options.docsFolder = docsFolder;
		options.name = meta.name;
		options.projectName = meta.packageName;

		if (args.tryme) {
			options.tryme = true;
		}

		if (args.ignoreOptional) {
			options.ignoreOptional = true;
		}

		docsify.initialize(docsFolder, meta);

		let sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();

		if (typeof args.jsdoc === 'string') {
			steps.jsdoc = true;
		} else if (typeof args.jsdoc === 'boolean') {
			steps.jsdoc = args.jsdoc;
		}

		if (typeof args.openapi === 'string') {
			steps.openapi = true;
		} else if (typeof args.openapi === 'boolean') {
			steps.openapi = args.openapi;
		}

		if (steps.jsdoc === undefined) {
			const { jsdoc } = await inquirer.prompt({
				type: 'confirm',
				name: 'jsdoc',
				message: 'Do you want to generate documentation from JSDoc?:'
			});

			steps.jsdoc = jsdoc;
		}

		if (steps.jsdoc) {
			if (!cachedPaths[JSDOC_PATH] && typeof args.jsdoc !== 'string') {
				questions.push(jsdocQuestion);
			}

			if (typeof args.jsdoc === 'string') {
				sourcePaths[JSDOC_PATH] = args.jsdoc;
			}

			sidebar = sidebar.replace(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm, '<!-- sdk_open -->\n* [SDK Reference](/content/sdk_reference)\n<!-- sdk_close -->');

			fs.writeFileSync(path.resolve(docsFolder, '_sidebar.md'), sidebar);
		}

		if (steps.openapi === undefined) {
			const { openapi } = await inquirer.prompt({
				type: 'confirm',
				name: 'openapi',
				message: 'Do you want to generate documentation from OpenAPI file?:'
			});

			steps.openapi = openapi;
		}

		if (steps.openapi) {
			if (!cachedPaths[OPEN_API_PATH] && typeof args.openapi !== 'string') {
				questions.push(openAPIQuestion);
			}

			if (typeof args.openapi === 'string') {
				sourcePaths[OPEN_API_PATH] = args.openapi;
			}

			sidebar = sidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, '<!-- api_open -->\n* [API Reference](/content/api_reference)\n<!-- api_close -->');

			fs.writeFileSync(path.resolve(docsFolder, '_sidebar.md'), sidebar);
		}

		if (questions.length) {
			const { openapiPath, jsdocPath } = await inquirer.prompt(questions);

			if (openapiPath) {
				sourcePaths.openapiPath = openapiPath;
			}

			if (jsdocPath) {
				sourcePaths.jsdocPath = jsdocPath;
			}
		}

		console.info(chalk.grey('Beginning generating documentation...'));

		if (steps.jsdoc) {
			if (!sourcePaths[JSDOC_PATH] && !cachedPaths[JSDOC_PATH]) {
				console.error(chalk.red('The path to the source code not found. JSDoc documentation skipped.'));
			} else {
				options.jsdocPath = sourcePaths.jsdocPath;

				const jsdocGenerator = new JSDocGenerator(options);

				await jsdocGenerator.generate().then(() => {
					console.info(chalk.greenBright('JSDoc documentation generated.'));
				}).catch((err) => {
					console.error(chalk.red('Generation of the JSDoc documentation has failed.'));
					console.error(chalk.red(err.stack));
				});
			}
		}

		if (steps.openapi) {
			if (!sourcePaths[OPEN_API_PATH] && !cachedPaths[OPEN_API_PATH]) {
				console.error(chalk.red('The path to the OpenAPI file not found. Open API documentation skipped.'));
			} else {
				options.openApiPath = sourcePaths.openapiPath;

				const openApiGenerator = new OpenAPIGenerator(options);

				await openApiGenerator.generate().then(() => {
					console.info(chalk.greenBright('OpenAPI documentation generated.'));
				}).catch((err) => {
					console.error(chalk.red('Generation of the OpenAPI documentation has failed.'));
					console.error(chalk.red(err.stack));
				});
			}
		}

		updateSidebars(docsFolder);

		return generateReleases(args.releases).catch((err) => {
			chalk.red(err);
		});
	}

	/**
	 * Copy sidebar to other folders.
	 *
	 * @param {string} docFolder - a path to the docs folder
	 */
	function updateSidebars(docFolder) {
		const contentDir = path.resolve(docsFolder, 'content');
		const conceptsDir = path.resolve(contentDir, 'concepts');

		fs.copyFileSync(path.resolve(docFolder, '_sidebar.md'), path.resolve(contentDir, '_sidebar.md'));
		fs.copyFileSync(path.resolve(docFolder, '_sidebar.md'), path.resolve(conceptsDir, '_sidebar.md'));

		const apiSidebarPath = path.resolve(contentDir, 'api', '_sidebar.md');
		const sdkSidebarPath = path.resolve(contentDir, 'sdk', '_sidebar.md');

		const rootSidebar = fs.readFileSync(path.resolve(docFolder, '_sidebar.md')).toString();

		if (fs.existsSync(apiSidebarPath)) {
			const apiSidebarString = fs.readFileSync(apiSidebarPath).toString();
			const apiSidebarContentMatch = apiSidebarString.match(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm);
			if (apiSidebarContentMatch !== null) {
				const apiSidebarContent = apiSidebarContentMatch[0];
				const updatedSidebar = rootSidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebarContent);

				fs.writeFileSync(apiSidebarPath, updatedSidebar);
			}
		}

		if (fs.existsSync(sdkSidebarPath)) {
			const sdkSidebarString = fs.readFileSync(sdkSidebarPath).toString();
			const sdkSidebarContentMatch = sdkSidebarString.match(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm);

			if (sdkSidebarContentMatch !== null) {
				const sdkSidebarContent = sdkSidebarContentMatch[0];
				const updatedSidebar = rootSidebar.replace(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm, sdkSidebarContent);

				fs.writeFileSync(sdkSidebarPath, updatedSidebar);
			}
		}
	}

	return generateDocs;
})();
