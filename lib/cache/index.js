const fs = require('fs');
const path = require('path');

/**
 * Cache class controls paths to a source code and OpenAPI file of packages.
 *
 * @constructor
 */
class Cache {
	constructor() {
		this.cacheFolder = path.resolve(__dirname, '../../.cache');
		this.pathToCache = path.resolve(this.cacheFolder, 'cache.json');
		this.cache = {};

		const isCacheExist = fs.existsSync(this.pathToCache);

		if (isCacheExist) {
			const cache = fs.readFileSync(this.pathToCache);
			this.cache = JSON.parse(cache.toString());
		} else {
			fs.mkdirSync(this.cacheFolder);
			fs.writeFileSync(this.pathToCache, JSON.stringify(this.cache));
		}
	}

	/**
	 * Adds and save cache for package.
	 * @param name -a package name.
	 * @param {Object} paths - an object with paths.
	 * @param {String} [paths.openapiPath] - a path to the Open API file.
	 * @param {String} [paths.jsdocPath] - a path to the source code.
	 */
	add(name, paths) {
		this.cache[name] = paths;
		this.save();
	}

	/**
	 * Clear cached data of package.
	 *
	 * @param {String} name - a package name.
	 */
	delete(name) {
		delete this.cache[name];
		this.save();
	}

	/**
	 * Returns cached package data.
	 *
	 * @param {String} name - a package name.
	 * @returns {{ jsdocPath, openapiPath }|{}}
	 */
	get(name) {
		return this.cache[name] || {};
	}

	/**
	 * Deletes cache for all packages.
	 */
	clear() {
		this.cache = {};
		this.save();
	}

	/**
	 * Writes cache to the file.
	 */
	save() {
		fs.writeFileSync(this.pathToCache, JSON.stringify(this.cache));
	}
}

module.exports = Cache;
