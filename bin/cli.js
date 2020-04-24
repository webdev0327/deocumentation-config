#!/usr/bin/env node

const docsify = require('../docsify');

const { program } = require('commander');
program.version('0.0.0');

program
	.command('generate')
	.description('generate documentation')
	.option('-J', '--jsdoc')
	.option('-O', '--openapi')
	.action((args) => {
		const docsFolder = `${process.cwd()}/docs`;
		//TODO ask for docs folder
		//TODO ask for path to src
		//TODO ask for path to openapi.yml

		docsify.initialize(docsFolder, 'name', 'repo');

		//TODO check flags and run
		// check flag and parse JSON
		// check flag and parse OPENAPI
	});

program.parse(process.argv);
