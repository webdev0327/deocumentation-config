#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const { program } = require('commander');

const Cache = require('../lib/cache');
const docsify = require('../lib/docsify');
const fs = require('../lib/fsSafe');
const jsdoc = require('../lib/generators/jsdoc');
const openapi2md = require('../lib/generators/openapi');
const pckg = require('./../package.json');
const releases = require('../lib/releases');
const templates = require('../lib/templates');

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

program.version(pckg.version);

program.on('--help', () => {
	console.info('\nComplete documentation for this tool can be found at https://barchart.github.io/documentation-generator/#/');
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

		const meta = await getMeta();
		const cachedPaths = cache.get(meta.name);

		docsify.initialize(docsFolder, meta);

		let sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();

		if (typeof args.jsdoc === 'string') {
			steps.jsdoc = true;
		}

		if (typeof args.openapi === 'string') {
			steps.openapi = true;
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
				console.error('The path to the source code not found. JSDoc documentation skipped.');
			} else {
				const resolvedPath = resolvePath(JSDOC_PATH, sourcePaths, meta, cachedPaths);

				if (resolvedPath.isSourceExist) {
					await jsdoc
						.generateDocumentation({
							docsFolder: docsFolder,
							jsdocPath: resolvedPath.path,
							packageName: meta.packageName
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					console.error('The path to the source code not found. JSDoc documentation skipped.');
				}
			}
		}

		if (steps.openapi) {
			if (!sourcePaths[OPEN_API_PATH] && !cachedPaths[OPEN_API_PATH]) {
				console.error('The path to the OpenAPI file not found. Open API documentation skipped.');
			} else {
				const resolvedPath = resolvePath(OPEN_API_PATH, sourcePaths, meta, cachedPaths);

				if (resolvedPath.isSourceExist) {
					const options = {};
					const splitPath = resolvedPath.path.split('/');
					const file = splitPath.pop();
					const splitFile = file.split('.');
					const fileName = splitFile[0];
					const fileExtension = splitFile[1];
					if (fileExtension && (fileExtension.toLowerCase() === 'yaml' || fileExtension.toLowerCase() === 'yml' || fileExtension.toLowerCase() === 'json')) {
						options.filename = fileName;
						options.fileExtension = fileExtension;
						if (args.tryme) {
							options.tryme = true;
						}
						await openapi2md.generateDocumentation(resolvedPath.path, docsFolder, options).catch((err) => {
							console.error(err);
						});
					} else {
						console.error('The CLI supports only following file extensions: [json, yaml, yml]. Open API documentation skipped.');
					}
				} else {
					console.error('The path to the OpenAPI file not found. Open API documentation skipped.');
				}
			}
		}

		updateSidebars(docsFolder);
		releases.generateReleaseNotes(docsFolder);
	});

program
	.command('releases')
	.description('rebuilds release notes')
	.action(async (args) => {
		const isReleasesExist = fs.existsSync(path.resolve(docsFolder, 'content', 'releases'));
		const isReleaseNotesExist = fs.existsSync(path.resolve(docsFolder, 'content', 'release_notes.md'));

		if (isReleasesExist && isReleaseNotesExist) {
			templates.registerPartials();
			releases.generateReleaseNotes(docsFolder);
			console.info('Release notes was updated');
		} else {
			console.error(`file [ ${path.resolve(docsFolder, 'content', 'release_notes.md')} ] or [ ${path.resolve(docsFolder, 'content', 'releases')} ] folder doesn't exist`);
		}
	});

program
	.command('init')
	.description('creates docs folder and suggested page skeleton')
	.action(async (args) => {
		const meta = await getMeta();

		docsify.initialize(docsFolder, meta);
		releases.generateReleaseNotes(docsFolder);
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
		if (args.all) {
			cache.clear();
			console.info('Cache was cleared');
		} else {
			const meta = await getMeta();

			cache.delete(meta.name);
			console.info(`Cache was cleared for package [ ${meta.name} ]`);
		}
	});

async function getMeta() {
	let packageJSONFile = path.resolve(executionPath, 'package.json');

	let meta = getMetaFromPackage(packageJSONFile);

	if (meta === undefined) {
		const answer = await inquirer.prompt({
			type: 'input',
			name: 'pkg',
			message: `Enter the path to the package.json file (${executionPath}/):`
		});

		if (!answer.pkg) {
			exit('package.json not found');
		}

		packageJSONFile = path.resolve(executionPath, answer.pkg);

		meta = getMetaFromPackage(packageJSONFile, true);
	}

	return meta;
}

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

	if (sourcePaths[source]) {
		const insertPath = path.resolve(executionPath, sourcePaths[source]);
		isSourceExist = fs.existsSync(insertPath);
		if (isSourceExist) {
			sourcePath = insertPath;
			cachedPaths[source] = insertPath;
			cache.add(meta.name, cachedPaths);
		}
	}

	if (!sourcePaths[source] && cachedPaths[source]) {
		isSourceExist = fs.existsSync(cachedPaths[source]);
		if (!isSourceExist) {
			delete cachedPaths[source];
			cache.add(meta.name, cachedPaths);
		} else {
			sourcePath = cachedPaths[source];
		}
	}

	return { path: sourcePath, isSourceExist: isSourceExist };
}

/**
 * Gets meta data from package.json.
 *
 * @param {String} packagePath - Path to the package.json file
 * @param {Boolean} error - stop execution if error handled
 * @returns {{name: string, description: *, repository: *, version: *}|undefined}
 */
function getMetaFromPackage(packagePath, error = false) {
	const isPackageJSON = fs.existsSync(packagePath);

	if (!isPackageJSON) {
		if (error) {
			exit('package.json not found');
		} else {
			return {
				name: 'Your Project Name',
				packageName: 'yourprojectname',
				version: '',
				description: '',
				repository: ''
			};
		}
	}

	const pkg = require(packagePath);

	return {
		name: pkg.name,
		packageName: pkg.name,
		version: pkg.version,
		description: pkg.description,
		repository: pkg.repository ? pkg.repository.url : ''
	};
}

/**
 *
 * @param {String} error - Error message
 */
function exit(error) {
	console.error(error);
	process.exit(1);
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
		const apiSidebarContent = apiSidebarString.match(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm)[0];
		const updatedSidebar = rootSidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebarContent);

		fs.writeFileSync(apiSidebarPath, updatedSidebar);
	}

	if (fs.existsSync(sdkSidebarPath)) {
		const sdkSidebarString = fs.readFileSync(sdkSidebarPath).toString();
		const sdkSidebarContent = sdkSidebarString.match(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm)[0];
		const updatedSidebar = rootSidebar.replace(/(<!-- sdk_open -->(\s|.)*<!-- sdk_close -->)/gm, sdkSidebarContent);

		fs.writeFileSync(sdkSidebarPath, updatedSidebar);
	}
}

program.parse(process.argv);
