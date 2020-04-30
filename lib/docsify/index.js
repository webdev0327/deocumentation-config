const docsifyInit = require('docsify-cli/lib/commands/init');
const docsifyServe = require('docsify-cli/lib/commands/serve');
const fs = require('fs');

const templates = require('../templates');

/**
 * Creates documentation folders
 *
 * @param {String} docsFolder - path to the docs folder
 */
function generateFolderStructure(docsFolder) {
	fs.mkdirSync(`${docsFolder}/content/sdk`, { recursive: true });
	fs.mkdirSync(`${docsFolder}/content/releases`, { recursive: true });
	fs.mkdirSync(`${docsFolder}/content/concepts`, { recursive: true });
	fs.mkdirSync(`${docsFolder}/styles`, { recursive: true });
}

/**
 *
 * @param {String} docsFolder - path to the docs folder
 * @param {Object} meta - an object with the meta data
 * @param {String} meta.name - a name of the project
 * @param {String} meta.version - a version of the project
 * @param {String} meta.description - a description of the project
 * @param {String} meta.repository - a link to the repository
 */
function initialize(docsFolder, meta) {
	const isInited = fs.existsSync(`${docsFolder}/index.html`);

	templates.registerPartials();

	if (!isInited) {
		generateFolderStructure(docsFolder);
		docsifyInit(`${docsFolder}/`, '', 'vue');

		const isReadme = fs.existsSync(`${docsFolder}/README.md`);

		if (isReadme) {
			fs.unlinkSync(`${docsFolder}/README.md`);
		}

		const indexHTML = templates.compilePartial('{{>indexhtml}}', { name: meta.name, repo: meta.repository });
		const coverPage = templates.compilePartial('{{>coverpage}}', {
			name: meta.name,
			version: meta.version,
			description: meta.description
		});
		const productOverview = templates.compilePartial('{{>product_overview}}');
		const quickStart = templates.compilePartial('{{>quick_start}}');
		const releases = templates.compilePartial('{{>releases_notes}}');
		const sidebar = templates.compilePartial('{{>sidebar}}');

		// read other files
		const stylesData = fs.readFileSync(`${__dirname}/files/override.css`).toString();

		// save files
		try {
			fs.writeFileSync(`${docsFolder}/index.html`, indexHTML);
			fs.writeFileSync(`${docsFolder}/_coverpage.md`, coverPage);
			fs.writeFileSync(`${docsFolder}/content/product_overview.md`, productOverview);
			fs.writeFileSync(`${docsFolder}/content/quick_start.md`, quickStart);
			fs.writeFileSync(`${docsFolder}/content/release_notes.md`, releases);
			fs.writeFileSync(`${docsFolder}/_sidebar.md`, sidebar);
			fs.writeFileSync(`${docsFolder}/styles/override.css`, stylesData);
		} catch (e) {
			console.log(e);
		}
	}
}

/**
 * Serve documentation
 *
 * @param path
 */
function serve(path) {
	docsifyServe(path, false, 3000);
}

module.exports = {
	initialize,
	serve
};
