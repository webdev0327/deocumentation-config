const DmdOptions = require('./dmd-options');

function dmd(templateData, options) {
	options = new DmdOptions(options);

	return Promise.resolve(generate(templateData, options));
}

function generate(templateData, options) {
	const arrayify = require('array-back');
	const FileSet = require('file-set');
	const fs = require('fs');
	const path = require('path');
	const handlebars = require('handlebars').create();
	const walkBack = require('walk-back');

	const DmdOptions = require('./dmd-options');

	function registerPartials(paths) {
		const fileSet = new FileSet(paths);
		fileSet.files.forEach(function(file) {
			handlebars.registerPartial(path.basename(file, '.hbs'), fs.readFileSync(file, 'utf8') || '');
		});
	}

	function registerHelpers(helpers) {
		const fileSet = new FileSet(helpers);
		fileSet.files.forEach(function(file) {
			handlebars.registerHelper(require(path.resolve(process.cwd(), file)));
		});
	}

	/* Register handlebars helper modules */
	['./helpers/helpers'].forEach(function(modulePath) {
		handlebars.registerHelper(require(modulePath));
	});

	templateData = arrayify(templateData);
	options = Object.assign(new DmdOptions(), options);
	options.plugin = arrayify(options.plugin);

	registerPartials(path.resolve(__dirname, './partials/**/*.hbs'));

	if (options.plugin) {
		for (let i = 0; i < options.plugin.length; i++) {
			const plugin = options.plugin[i];
			let modulePath = '';

			if (fs.existsSync(path.resolve(plugin))) {
				modulePath = path.resolve(plugin);
			} else {
				modulePath = walkBack(process.cwd(), path.join('node_modules', plugin));
			}

			if (modulePath) {
				const pluginOptions = require(modulePath)(options);
				options.partial = options.partial.concat(pluginOptions.partial);
				options.helper = options.helper.concat(pluginOptions.helper);
			} else {
				throw new Error('Cannot find plugin: ' + plugin);
			}
		}
	}

	if (options.partial.length) registerPartials(options.partial);
	if (options.helper.length) registerHelpers(options.helper);

	const compiled = handlebars.compile(options.template, {
		preventIndent: true,
		strict: false
	});
	templateData.options = options;

	return compiled(templateData);
}

module.exports = dmd;
