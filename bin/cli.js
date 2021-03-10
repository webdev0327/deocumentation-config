#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const { program } = require('commander');

const Cache = require('../lib/common/cache');
const docsify = require('../lib/docsify');
const fs = require('../lib/common/fsSafe');
const JSDocGenerator = require('../lib/generators/jsdoc/JSDocGenerator');
const OpenAPIGenerator = require('../lib/generators/openapi/OpenAPIGenerator');
const Options = require('../lib/common/options/Options');
const pkgData = require('./../package.json');
const ProjectMeta = require('../lib/common/projectMeta/ProjectMeta');
const releases = require('../lib/releases');

// commands
const clearCacheCommand = require('../lib/commands/clearCache');
const generateReleasesCommand = require('../lib/commands/generateReleases');
const initDocsCommand = require('../lib/commands/initDocs');

const OPEN_API_PATH = 'openapiPath';
const JSDOC_PATH = 'jsdocPath';

const cache = new Cache();
const executionPath = process.cwd();
const docsFolder = path.resolve(executionPath, 'docs');

const steps = {
	jsdoc: undefined,
	openapi: undefined
};
const jsdocQuestion = {
	type: 'input',
	name: JSDOC_PATH,
	message: `Enter the path to the JavaScript source code (${executionPath}/):`
};
const openAPIQuestion = {
	type: 'input',
	name: OPEN_API_PATH,
	message: `Enter the path to the OpenAPI file (${executionPath}/):`
};

/**
 * Parses a parseFlag value to boolean
 *
 * @param value - a flag value
 * @returns {boolean | string}
 */
function parseFlag(value) {
	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}
	
	return value;
}

program.version(pkgData.version);

program.on('--help', () => {
	console.info(chalk.yellow('\nComplete documentation for this tool can be found at https://barchart.github.io/documentation-generator/#/'));
});

program
	.command('generate')
	.description('rebuilds auto-generated content (e.g. SDK Reference section, API Reference section, sidebars, and release notes)')
	.option('-o, --openapi [string | boolean]', 'rebuilds your SDK Reference (for JavaScript). Argument is relative path to your code directory', parseFlag)
	.option('-j, --jsdoc [string | boolean]', 'rebuilds your API Reference (for web services). Argument is relative path to OpenAPI file', parseFlag)
	.option('-t, --tryme', 'adds an interactive "try me" page for your web service API')
	.action(async (args) => {
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

		docsify.initialize(docsFolder, meta);

		let sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();

		if (typeof args.jsdoc === 'string') {
			steps.jsdoc = true;
		} if (typeof args.jsdoc === 'boolean') {
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
				if (args.tryme) {
					options.tryme = true;
				}
				
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
		releases.generateReleaseNotes(docsFolder);
	});

program
	.command('releases')
	.description('rebuilds release notes')
	.action(async (args) => {
		generateReleasesCommand();
	});

program
	.command('init')
	.description('creates docs folder and suggested page skeleton')
	.action(async (args) => {
		await initDocsCommand();
	});

program
	.command('serve')
	.description('runs a local web server from the docs folder')
	.action(async (args) => {
		docsify.serve(docsFolder);
	});

program
	.command('clear-cache')
	.description('clears saved data (e.g. the path to your code and the path to your OpenAPI file)')
	.option('-a, --all', 'clears saved data for all packages')
	.action(async (args) => {
		return clearCacheCommand(args);
	});

/**
 * Returns a path to the source and is the source exists
 *
 * @param source - a source
 * @param sourcePaths - paths for sources
 * @param meta - a meta data of a package
 * @param cachedPaths - cached paths for sources
 * @returns {{path: string, isSourceExist: boolean}}
 */
function resolvePath(source, sourcePaths, meta, cachedPaths) {
	let sourcePath = '';
	let isSourceExist = false;
	const isUrlPath = urlRegex.test(sourcePaths[OPEN_API_PATH]);

	if (sourcePaths[source]) {
		let insertPath = path.resolve(executionPath, sourcePaths[source]);
		
		if (isUrlPath) {
			insertPath = sourcePaths[source];
			isSourceExist = true;
		} else {
			isSourceExist = fs.existsSync(insertPath);
		}
		
		if (isSourceExist) {
			sourcePath = insertPath;
			cachedPaths[source] = insertPath;
			cache.add(meta.name, cachedPaths);
		}
	}

	if (!sourcePaths[source] && cachedPaths[source]) {
		if (isUrlPath) {
			isSourceExist = true;
		} else {
			isSourceExist = fs.existsSync(cachedPaths[source]);
		}
		
		if (!isSourceExist) {
			delete cachedPaths[source];
			cache.add(meta.name, cachedPaths);
		} else {
			sourcePath = cachedPaths[source];
		}
	}

	return { path: sourcePath, isSourceExist: isSourceExist, isUrl: isUrlPath };
}

/**
 * Copy sidebar to other folders.
 *
 * @param {string} docFolder - a path to the docs folder
 */
function updateSidebars(docFolder) {
	const contentDir = path.resolve(docsFolder, 'content');
	const conceptsDir = path.resolve(contentDir, 'concepts');
	const releasesDir = path.resolve(contentDir, 'releases');

	fs.copyFileSync(path.resolve(docFolder, '_sidebar.md'), path.resolve(contentDir, '_sidebar.md'));
	fs.copyFileSync(path.resolve(docFolder, '_sidebar.md'), path.resolve(conceptsDir, '_sidebar.md'));
	fs.copyFileSync(path.resolve(docFolder, '_sidebar.md'), path.resolve(releasesDir, '_sidebar.md'));

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

process.on('unhandledRejection', (error) => {
	console.error(chalk.red('Something going wrong: ', error.message));
	console.error(chalk.red('Stack: ', error.stack));
});

program.parse(process.argv);
