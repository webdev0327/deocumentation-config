const path = require('path');

const Cache = require('../../common/cache');
const fs = require('../../common/fsSafe');

module.exports =  (() => {
	const urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
	
	const cache = new Cache();
	const executionPath = process.cwd();
	
	class BaseGenerator {
		constructor(options) {
			this._options = options;
		}
		
		get options() {
			return this._options;
		}
		
		generate() {
			return Promise.resolve()
				.then(() => {
					return this._generate();
				});
		}

		/**
		 * Generates documentation from source.
		 * 
		 * @returns {Promise | null}
		 * @private
		 */
		_generate(){
			return null;
		}

		/**
		 * Resolves path to the source
		 * 
		 * @param {String} type - type of source
		 * @param {String} originalPath - path to the source
		 * @returns {Promise<{path, isSourceExist, isUrl}>}
		 */
		resolvePath(type, originalPath) {
			return Promise.resolve()
				.then(() => {
					return this._resolvePath(type, originalPath);
				});
		}
		
		_resolvePath(type, originalPath) {
			return Promise.resolve()
				.then(() => {
					let sourcePath = '';
					let isSourceExist = false;
					let isUrlPath = urlRegex.test(originalPath);
					const cachedPaths = cache.get(this.options.name);
					
					if (originalPath) {
						let insertPath = path.resolve(executionPath, originalPath);

						if (isUrlPath) {
							insertPath = originalPath;
							isSourceExist = true;
						} else {
							isSourceExist = fs.existsSync(insertPath);
						}

						if (isSourceExist) {
							sourcePath = insertPath;
							cachedPaths[type] = insertPath;
							cache.add(this.options.name, cachedPaths);
						}
					}

					if (!originalPath && cachedPaths[type]) {
						isUrlPath = urlRegex.test(cachedPaths[type]);
						if (isUrlPath) {
							isSourceExist = true;
						} else {
							isSourceExist = fs.existsSync(cachedPaths[type]);
						}

						if (!isSourceExist) {
							delete cachedPaths[type];
							cache.add(this.options.name, cachedPaths);
						} else {
							sourcePath = cachedPaths[type];
						}
					}

					return { path: sourcePath, isSourceExist: isSourceExist, isUrl: isUrlPath };
				});
		}
	}
	
	return BaseGenerator;
})();