#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const docsify = require('../lib/docsify');
const openapi2md = require('../lib/openapi');
const jsdoc = require('../lib/jsdoc');
const pckg = require('./../package.json');

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

program.version(pckg.version);

program
	.command('generate')
	.description('initialize and generate documentation')
	.option('-j, --jsdoc', 'Generate JSDoc only')
	.option('-o, --openapi', 'Generate OpenAPI only')
	.action(async (args) => {
		let isJSDoc = args.jsdoc;
		let isOpenAPI = args.openapi;

		if (!isJSDoc && !isOpenAPI) {
			isJSDoc = true;
			isOpenAPI = true;
		}

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

		if (isJSDoc) {
			questions.push(jsdocQuestion);
		}

		if (isOpenAPI) {
			questions.push(openapiQuestion);
		}

		const answers = await inquirer.prompt(questions);

		docsify.initialize(docsFolder, meta);

		if (isJSDoc) {
			if (!answers.src) {
				exit('The path to the source code not found');
			}

			const srcPath = path.join(executionPath, answers.src);

			const isSourceFolderExist = fs.existsSync(srcPath);

			if (!isSourceFolderExist) {
				exit('The path to the source code not found');
			}

			await jsdoc
				.generateDocs({
					docsFolder: docsFolder,
					srcPath: srcPath,
					packageName: meta.name
				})
				.catch((err) => {
					console.error(err);
				});
		}

		if (isOpenAPI) {
			if (!answers.openapi) {
				exit('The path to the OpenAPI file not found');
			}

			const openAPIPath = path.join(executionPath, answers.openapi);

			const isOpenAPIFileExist = fs.existsSync(openAPIPath);

			if (!isOpenAPIFileExist) {
				exit('The path to the OpenAPI file not found');
			}

			await openapi2md.getOpenAPIOutput(openAPIPath, docsFolder).catch((err) => {
				console.error(err);
			});
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

program
	.command('serve')
	.description('serve documentation')
	.action(async (args) => {
		docsify.serve(docsFolder);
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
