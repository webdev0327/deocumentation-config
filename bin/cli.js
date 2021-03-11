#!/usr/bin/env node
const chalk = require('chalk');
const { program } = require('commander');

const pkgData = require('./../package.json');

// commands
const clearCacheCommand = require('../lib/commands/clearCache');
const generateDocsCommand = require('../lib/commands/generateDocs');
const generateReleasesCommand = require('../lib/commands/generateReleases');
const initDocsCommand = require('../lib/commands/initDocs');
const serveDocsCommand = require('../lib/commands/serveDocs');

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
		await generateDocsCommand(args);
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
		serveDocsCommand();
	});

program
	.command('clear-cache')
	.description('clears saved data (e.g. the path to your code and the path to your OpenAPI file)')
	.option('-a, --all', 'clears saved data for all packages')
	.action(async (args) => {
		await clearCacheCommand(args);
	});

process.on('unhandledRejection', (error) => {
	console.error(chalk.red('Something going wrong: ', error.message));
	console.error(chalk.red('Stack: ', error.stack));
});

program.parse(process.argv);
