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
 * @returns {string} compiled template
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
	const swaggerHtmlFileData = fs.readFileSync(`${__dirname}/hbs/swaggerhtml.hbs`).toString();
	const tryMDFileData = fs.readFileSync(`${__dirname}/hbs/trymd.hbs`).toString();
	const releaseOne = fs.readFileSync(`${__dirname}/hbs/release_one.hbs`).toString();
	const releaseTwo = fs.readFileSync(`${__dirname}/hbs/release_two.hbs`).toString();
	const conceptOne = fs.readFileSync(`${__dirname}/hbs/concept_one.hbs`).toString();
	const conceptTwo = fs.readFileSync(`${__dirname}/hbs/concept_two.hbs`).toString();

	handlebars.registerPartial('indexhtml', indexFileData);
	handlebars.registerPartial('coverpage', coverPageFileData);
	handlebars.registerPartial('product_overview', productOverviewFileData);
	handlebars.registerPartial('quick_start', quickStartFileData);
	handlebars.registerPartial('releases_notes', releasesNotesFileData);
	handlebars.registerPartial('sidebar', sidebarFileData);
	handlebars.registerPartial('swaggerhtml', swaggerHtmlFileData);
	handlebars.registerPartial('trymd', tryMDFileData);
	handlebars.registerPartial('release_one', releaseOne);
	handlebars.registerPartial('release_two', releaseTwo);
	handlebars.registerPartial('concept_one', conceptOne);
	handlebars.registerPartial('concept_two', conceptTwo);
}

module.exports = {
	registerPartials,
	compilePartial
};
