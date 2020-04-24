const docsify = require('docsify-cli/lib/commands/init');
const Handlebars = require('handlebars');
const fs = require('fs');

const compileOptions = {
	preventIndent: true,
	strict: false
};

function registerPartials() {
	const indexFileData = fs.readFileSync(`${__dirname}/templates/hbs/index.hbs`).toString();
	const coverPageFileData = fs.readFileSync(`${__dirname}/templates/hbs/coverpage.hbs`).toString();
	const productOverviewFileData = fs
		.readFileSync(`${__dirname}/templates/hbs/product_overview.hbs`)
		.toString();
	const quickStartFileData = fs.readFileSync(`${__dirname}/templates/hbs/quick_start.hbs`).toString();
	const releasesNotesFileData = fs.readFileSync(`${__dirname}/templates/hbs/releases_notes.hbs`).toString();
	const sidebarFileData = fs.readFileSync(`${__dirname}/templates/hbs/sidebar.hbs`).toString();
	Handlebars.registerPartial('index', indexFileData);
	Handlebars.registerPartial('coverpage', coverPageFileData);
	Handlebars.registerPartial('product_overview', productOverviewFileData);
	Handlebars.registerPartial('quick_start', quickStartFileData);
	Handlebars.registerPartial('releases_notes', releasesNotesFileData);
	Handlebars.registerPartial('sidebar', sidebarFileData);
}

function generateFolderStructure(docsFolder) {
	fs.mkdirSync(`${docsFolder}/content/sdk`, { recursive: true });
	fs.mkdirSync(`${docsFolder}/content/releases`, { recursive: true });
	fs.mkdirSync(`${docsFolder}/styles`, { recursive: true });
}

function compilePartial(template, data = {}) {
	const compile = Handlebars.compile(template, compileOptions);

	return compile(data);
}

function initialize(docsFolder, name, repo, version) {
	const isInited = fs.existsSync(`${docsFolder}/index.html`);

	if (!isInited) {
		generateFolderStructure(docsFolder);
		docsify(`${docsFolder}/`, '', 'vue');

		const isReadme = fs.existsSync(`${docsFolder}/README.md`);

		if (isReadme) {
			fs.unlinkSync(`${docsFolder}/README.md`);
		}

		registerPartials();

		const indexHTML = compilePartial('{{>index}}', { name, repo });
		const coverPage = compilePartial('{{>coverpage}}', {
			name: 'name',
			version: 'v0.0.0',
			description: 'description'
		}); // TODO { name, description, version}
		const productOverview = compilePartial('{{>product_overview}}');
		const quickStart = compilePartial('{{>quick_start}}');
		const releases = compilePartial('{{>releases_notes}}');
		const sidebar = compilePartial('{{>sidebar}}');

		// read other files
		const stylesData = fs.readFileSync(`${__dirname}/templates/files/override.css`).toString();

		// save templates
		fs.writeFileSync(`${docsFolder}/index.html`, indexHTML);
		fs.writeFileSync(`${docsFolder}/content/_coverpage.md`, coverPage);
		fs.writeFileSync(`${docsFolder}/content/product_overview.md`, productOverview);
		fs.writeFileSync(`${docsFolder}/content/quick_start.md`, quickStart);
		fs.writeFileSync(`${docsFolder}/content/release_notes.md`, releases);
		fs.writeFileSync(`${docsFolder}/_sidebar.md`, sidebar);

		// save other files
		fs.writeFileSync(`${docsFolder}/styles/override.css`, stylesData);
	}
}

module.exports = {
	initialize
};
