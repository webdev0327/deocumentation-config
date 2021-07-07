const axios = require('axios');
const chalk = require('chalk');
const os = require('os');
const path = require('path');
const SwaggerParser = require('swagger-parser');
const swaggerUIPath = require('swagger-ui-dist').getAbsoluteFSPath();
const yaml = require('js-yaml');

const BaseGenerator = require('../base/BaseGenerator');
const dmd = require('./openapi2md/dmd');
const DmdOptions = require('./openapi2md/dmd-options');
const fs = require('../../common/fsSafe');
const OpenAPIOptions = require('./openapi2md/openapi-options');
const templates = require('../../templates');

module.exports = (() => {
	const yamlExtensions = ['yaml', 'yml'];
	const supportedFileExtensions = [...yamlExtensions, 'json'];
	
	class OpenAPIGenerator extends BaseGenerator {
		constructor(options) {
			super(options);
			
			this._swaggerParser = new SwaggerParser();
		}

		render(options) {
			options = options || {};
			const dmdOptions = new DmdOptions(options);
			if (options.data) {
				return dmd(options.data, dmdOptions);
			} else {
				return this.getOpenAPIData(options).then((templateData) => dmd(templateData, dmdOptions));
			}
		}

		getOpenAPIData(options) {
			const openAPIOptions = new OpenAPIOptions(options);

			if (!openAPIOptions.file) {
				throw new Error('File option required');
			}

			return this.validate(openAPIOptions.file).then(() => {
				let file = openAPIOptions.file;
				if (yamlExtensions.includes(openAPIOptions.fileExtension)) {
					file = yaml.load(fs.readFileSync(openAPIOptions.file));
				}
				
				return this._swaggerParser.parse(file);
			});
		}

		validate(path) {
			return this._swaggerParser.validate(path);
		}
		
		resolveUrl(url) {
			return Promise.resolve()
				.then(() => {
					const filename = fileNameFromUrl(url);

					if (!filename) {
						return Promise.reject('Can\t detect OpenAPI filename.');
					}
					
					return filename;
				}).then((filename) => {
					return axios.get(url).then((res) => {
						const fullFilename = fileNameFromUrl(url);
						const tempFile = path.resolve(this.options.docsFolder, 'tmp', fullFilename);

						if (filename) {
							fs.writeFileSync(tempFile, res.data);
						}

						return tempFile;
					}).catch(() => {
						throw new Error(`Can\'t fetch OpenAPI file from [ ${url} ].`);
					});
				});
		}
		
		_generate() {
			return Promise.resolve()
				.then(async () => {
					const resolvedPath = await this.resolvePath('openapiPath', this.options.openApiPath);
					let filePath = resolvedPath.path;
					
					if (resolvedPath.isSourceExist) {
						console.info(chalk.grey(`Reading OpenAPI from file ${resolvedPath.path}`));
						console.info(chalk.grey('Generating OpenAPI documentation...'));
						
						const fileOptions = { ... this.options };
						
						if (resolvedPath.isUrl) {
							try {
								filePath = await this.resolveUrl(resolvedPath.path);
							} catch (err) {
								throw new Error(err);
							}
						}

						const splitPath = filePath.split(os.platform() === 'win32' ? '\\' : '/');
						const file = splitPath.pop();
						const splitFile = file.split('.');
						const fileName = splitFile[0];
						const fileExtension = splitFile[1];

						fileOptions.filename = fileName;
						fileOptions.fileExtension = fileExtension;

						if (fileOptions.fileExtension && supportedFileExtensions.includes(fileOptions.fileExtension)) {
							await generateDocumentation.call(this, filePath, this.options.docsFolder, fileOptions).finally(() => {
								fs.rmdirSync(path.resolve(this.options.docsFolder, 'tmp'), { recursive: true });
							});
						} else {
							fs.rmdirSync(path.resolve(this.options.docsFolder, 'tmp'), { recursive: true });
							
							throw new Error('The CLI supports only following file extensions: [json, yaml, yml]. Open API documentation skipped.');
						}
					} else {
						console.error(chalk.red('The path to the OpenAPI file not found. Open API documentation skipped.'));
						throw new Error('The path to the OpenAPI file not found. Open API documentation skipped.');
					}
				});
		}
	}

	function fileNameFromUrl(url) {
		const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
		
		if (matches.length > 1) {
			return matches[1];
		}
		
		return null;
	}

	/**
	 * Generates documentation from OpenAPI file
	 *
	 * @param {String} openAPIPath - a path to the OpenAPI file
	 * @param {String} docsFolder - a path to the docs folder
	 * @param {Object} options - options for the OpenAPI generator
	 * @returns {Promise}
	 */
	function generateDocumentation(openAPIPath, docsFolder, options) {
		if (!openAPIPath || !docsFolder) {
			return Promise.reject('OpenAPI or Docs folder not found');
		}

		// Defines paths for directories
		const contentDir = path.resolve(docsFolder, 'content');
		const apiDir = path.resolve(contentDir, 'api');
		const swaggerDir = path.resolve(apiDir, 'swagger');

		// Gets data from a OpenAPI file
		return this.getOpenAPIData({ ...options, file: openAPIPath })
			.then((templateData) => {
				const promises = [];

				// Generates and saves api_reference.md
				const getLanding = this
					.render({
						data: templateData,
						template: '{{>main-landing}}',
						...options
					})
					.then((output) => {
						fs.writeFileSync(path.resolve(contentDir, 'api_reference.md'), output);
					});

				// Generates and saves paths.md
				const getPaths = this.render({ data: templateData, template: '{{>main-only-paths}}', ...options })
					.then((output) => {
						fs.writeFileSync(path.resolve(apiDir, 'paths.md'), output);
					});

				// Generates and saves components.md
				const getComponents = this.render({ data: templateData, template: '{{>main-only-components}}',...options })
					.then((output) => {
						if (output.length > 0) {
							fs.writeFileSync(path.resolve(apiDir, 'components.md'), output);
						}
					});

				promises.push(getLanding, getPaths, getComponents);
				
				return Promise.all(promises).then(() => {
					// Defines sidebars
					const componentsLink = fs.existsSync(path.resolve(apiDir, 'components.md')) ? '\t* [Components](/content/api/components)\n' : '';
					const pathsLink = fs.existsSync(path.resolve(apiDir, 'paths.md')) ? '\t* [Paths](/content/api/paths)\n' : '';
					const tryMeLink = options.tryme ? '\t* [Try Me](/content/api/try)\n' : '';
					const apiSidebar = `<!-- api_open -->\n* [API Reference](/content/api_reference)\n${componentsLink}${pathsLink}${tryMeLink}<!-- api_close -->`;
					
					const sidebar = fs.readFileSync(path.resolve(docsFolder, '_sidebar.md')).toString();
					const sidebarAPIFolder = sidebar.replace(/(<!-- api_open -->(\s|.)*<!-- api_close -->)/gm, apiSidebar);
					const openApiFilename = `${options.filename}.${options.fileExtension}`;

					fs.writeFileSync(path.resolve(apiDir, '_sidebar.md'), sidebarAPIFolder);
					fs.copyFileSync(openAPIPath, path.resolve(docsFolder, 'static', openApiFilename));

					if (options.tryme) {
						const swaggerHtml = templates.compilePartial('{{>swaggerhtml}}', { filename: openApiFilename });
						const tryMD = templates.compilePartial('{{>trymd}}');
						const swaggerCss = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui.css'));
						const swaggerJS = fs.readFileSync(path.join(swaggerUIPath, 'swagger-ui-bundle.js'));
						fs.writeFileSync(path.join(swaggerDir, 'swagger-ui.css'), swaggerCss);
						fs.writeFileSync(path.join(swaggerDir, 'swagger-ui-bundle.js'), swaggerJS);
						fs.writeFileSync(path.join(swaggerDir, 'swagger.html'), swaggerHtml);
						fs.writeFileSync(path.join(apiDir, 'try.md'), tryMD);
					}
				});
			});
	}
	
	return OpenAPIGenerator;
})();