#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const docsify = require('../docsify');
const openapi2md = require('../openapi');

const executionPath = process.cwd();
const docsFolder = path.join(executionPath, 'docs');
const jsdocQuestion = {
	type: 'input',
	name: 'src',
	message: `Enter the path to the source code (${executionPath}/):`
};

const openapiQuestion = {
	type: 'input',
	name: 'openapi',
	message: `Enter the path to the OpenAPI file (${executionPath}/):`
};

program.version('0.0.0'); //TODO get version from package.json

program
	.command('generate')
	.description('initialize and generate documentation')
	.option('-j, --jsdoc', 'Generate JSDoc only')
	.option('-o, --openapi', 'Generate OpenAPI only')
	.action(async (args) => {
		let packageJSONFile = path.join(executionPath, 'package.json');

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

			packageJSONFile = path.join(process.cwd(), answer.pkg);

			meta = getMetaFromPackage(packageJSONFile, true);
		}

		const questions = [];

		const onlyJSDoc = args.jsdoc && !args.openapi;
		const onlyOpenAPI = args.openapi && !args.jsdoc;

		let mode = 'all';

		if (onlyJSDoc) {
			mode = 'jsdoc';
		}

		if (onlyOpenAPI) {
			mode = 'openapi';
		}

		switch (mode) {
			case 'jsdoc': {
				questions.push(jsdocQuestion);
				const answers = await inquirer.prompt(questions);

				if (!answers.src) {
					exit('The path to the source code not found');
				}

				//TODO Check the path to a source code
				//TODO Generate JSDoc

				docsify.initialize(docsFolder, meta);
				break;
			}
			case 'openapi': {
				questions.push(openapiQuestion);
				const answers = await inquirer.prompt(questions);

				if (!answers.openapi) {
					exit('The path to the OpenAPI file not found');
				}

				const openAPIPath = path.join(executionPath, answers.openapi);

				const isExist = fs.existsSync(openAPIPath);

				if (!isExist) {
					exit('The path to the OpenAPI file not found');
				}

				docsify.initialize(docsFolder, meta);
				openapi2md.getOpenAPIOutput(openAPIPath, docsFolder).catch((err) => {
					exit(err);
				});
				break;
			}
			case 'all': {
				questions.push(jsdocQuestion, openapiQuestion);
				const answers = await inquirer.prompt(questions);

				if (!answers.src) {
					exit('The path to the source code not found');
				}

				if (!answers.openapi) {
					exit('The path to the OpenAPI file not found');
				}

				const openAPIPath = path.join(executionPath, answers.openapi);

				const isExist = fs.existsSync(openAPIPath);

				if (!isExist) {
					exit('The path to the OpenAPI file not found');
				}

				//TODO Check the path to a source code
				//TODO Generate JSDoc

				docsify.initialize(docsFolder, meta);
				openapi2md.getOpenAPIOutput(openAPIPath, docsFolder).catch((err) => {
					exit(err);
				});
				break;
			}
		}
	});

program
	.command('init')
	.description('initialize documentation structure')
	.action(async (args) => {
		let packageJSONFile = path.join(executionPath, 'package.json');

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

			packageJSONFile = path.join(process.cwd(), answer.pkg);

			meta = getMetaFromPackage(packageJSONFile, true);
		}

		docsify.initialize(docsFolder, meta);
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
