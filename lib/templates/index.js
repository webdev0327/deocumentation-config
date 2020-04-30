const fs = require('fs');
const handlebars = require('handlebars').create();

const compileOptions = {
	preventIndent: true,
	strict: false
};

/**
 * Compiles template and return string
 *
 * @param {String} template - a template string
 * @param {Object} data - an object with variables for template
 * @returns {string} - output
 */
function compilePartial(template, data = {}) {
	const compile = handlebars.compile(template, compileOptions);

	return compile(data);
}

/**
 * Registers templates
 */
function registerPartials() {
	const indexFileData = fs.readFileSync(`${__dirname}/hbs/indexhtml.hbs`).toString();
	const coverPageFileData = fs.readFileSync(`${__dirname}/hbs/coverpage.hbs`).toString();
	const productOverviewFileData = fs.readFileSync(`${__dirname}/hbs/product_overview.hbs`).toString();
	const quickStartFileData = fs.readFileSync(`${__dirname}/hbs/quick_start.hbs`).toString();
	const releasesNotesFileData = fs.readFileSync(`${__dirname}/hbs/releases_notes.hbs`).toString();
	const sidebarFileData = fs.readFileSync(`${__dirname}/hbs/sidebar.hbs`).toString();
	handlebars.registerPartial('indexhtml', indexFileData);
	handlebars.registerPartial('coverpage', coverPageFileData);
	handlebars.registerPartial('product_overview', productOverviewFileData);
	handlebars.registerPartial('quick_start', quickStartFileData);
	handlebars.registerPartial('releases_notes', releasesNotesFileData);
	handlebars.registerPartial('sidebar', sidebarFileData);
}

module.exports = {
	registerPartials,
	compilePartial
};
