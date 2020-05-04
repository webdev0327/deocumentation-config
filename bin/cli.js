#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const Cache = require('../lib/cache');
const docsify = require('../lib/docsify');
const openapi2md = require('../lib/openapi');
const jsdoc = require('../lib/jsdoc');
const pckg = require('./../package.json');

const executionPath = process.cwd();
const docsFolder = path.resolve(executionPath, 'docs');

const steps = {
	jsdoc: false,
	openapi: true
};
const jsdocQuestion = {
	type: 'input',
	name: 'src',
	message: `Enter the path to the source code (${executionPath}/):`
};
const openAPIQuestion = {
	type: 'input',
	name: 'openapi',
	message: `Enter the path to the OpenAPI file (${executionPath}/):`
};

program.version(pckg.version);

program
	.command('generate')
	.description('initialize and generate documentation')
	.action(async (args) => {
		const cache = new Cache();
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

		const cachedMeta = cache.get(meta.name);

		const questions = [];

		const jsdocAnswer = await inquirer.prompt({
			type: 'confirm',
			name: 'jsdoc',
			message: `Do you want to generate documentation from JSDoc?:`
		});

		steps.jsdoc = jsdocAnswer.jsdoc;

		if (steps.jsdoc) {
			if (!cachedMeta.srcPath) {
				questions.push(jsdocQuestion);
			}
		}

		const openAPIAnswer = await inquirer.prompt({
			type: 'confirm',
			name: 'openapi',
			message: `Do you want to generate documentation from OpenAPI file?:`
		});

		steps.openapi = openAPIAnswer.openapi;

		if (steps.openapi) {
			if (!cachedMeta.openAPIPath) {
				questions.push(openAPIQuestion);
			}
		}

		const answers = await inquirer.prompt(questions);

		docsify.initialize(docsFolder, meta);

		if (steps.jsdoc) {
			if (!answers.src && !cachedMeta.srcPath) {
				console.error('The path to the source code not found. JSDoc documentation skipped.');
			} else {
				let srcPath = '';

				let isSourceFolderExist = false;

				if (answers.src) {
					const insertPath = path.resolve(executionPath, answers.src);
					isSourceFolderExist = fs.existsSync(insertPath);
					if (isSourceFolderExist) {
						srcPath = insertPath;
						cachedMeta.srcPath = insertPath;
						cache.add(meta.name, cachedMeta);
					}
				}

				if (!answers.src && cachedMeta.srcPath) {
					isSourceFolderExist = fs.existsSync(cachedMeta.srcPath);
					if (!isSourceFolderExist) {
						delete cachedMeta.srcPath;
						cache.add(meta.name, cachedMeta);
					} else {
						srcPath = cachedMeta.srcPath;
					}
				}

				if (isSourceFolderExist) {
					await jsdoc
						.generateDocs({
							docsFolder: docsFolder,
							srcPath: srcPath,
							packageName: meta.name
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
			if (!answers.openapi && !cachedMeta.openAPIPath) {
				console.error('The path to the OpenAPI file not found. Open API documentation skipped.');
			} else {
				let openAPIPath = '';

				let isOpenAPIFileExist = false;

				if (answers.openapi) {
					const insertPath = path.resolve(executionPath, answers.openapi);
					isOpenAPIFileExist = fs.existsSync(insertPath);
					if (isOpenAPIFileExist) {
						openAPIPath = insertPath;
						cachedMeta.openAPIPath = insertPath;
						cache.add(meta.name, cachedMeta);
					}
				}

				if (!answers.openapi && cachedMeta.openAPIPath) {
					isOpenAPIFileExist = fs.existsSync(cachedMeta.openAPIPath);
					if (!isOpenAPIFileExist) {
						delete cachedMeta.openAPIPath;
						cache.add(meta.name, cachedMeta);
					} else {
						openAPIPath = cachedMeta.openAPIPath;
					}
				}

				if (isOpenAPIFileExist) {
					await openapi2md.getOpenAPIOutput(openAPIPath, docsFolder).catch((err) => {
						console.error(err);
					});
				} else {
					console.error('The path to the OpenAPI file not found. Open API documentation skipped.');
				}
			}
		}
	});

program
	.command('init')
	.description('initialize documentation structure')
	.action(async (args) => {
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

		docsify.initialize(docsFolder, meta);
	});

program
	.command('serve')
	.description('serve documentation')
	.action(async (args) => {
		docsify.serve(docsFolder);
	});

program
	.command('clear-cache')
	.description('clear all cache')
	.action(async (args) => {
		const cache = new Cache();
		cache.clear();
		console.log('Cache was cleared');
	});

program
	.command('clear-package-cache')
	.description('clear package cache')
	.action(async (args) => {
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

		const cache = new Cache();

		cache.delete(meta.name);
		console.log(`Cache was cleared for package [ ${meta.name} ]`);
	});

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
			return undefined;
		}
	}

	const pkg = require(packagePath);

	return {
		name: pkg.name,
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

program.parse(process.argv);
