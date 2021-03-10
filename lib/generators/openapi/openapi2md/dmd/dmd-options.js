function DmdOptions(options) {
	const arrayify = require('array-back');
	options = options || {};

	this.template = '{{>main}}';
	this.filename = null;
	this.fileExtension = 'yaml';
	this.separators = true;
	this.tryme = false;

	Object.assign(this, options);

	this.plugin = arrayify(options.plugin);
	this.helper = arrayify(options.helper);
	this.partial = arrayify(options.partial);
}

module.exports = DmdOptions;
