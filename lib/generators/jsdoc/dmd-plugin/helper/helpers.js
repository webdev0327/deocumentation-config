const arrayify = require('array-back');
const commonSequence = require('common-sequence');
const handlebars = require('handlebars');
const unique = require('reduce-unique');
const util = require('util');
const where = require('test-value').where;
const without = require('reduce-without');

const state = require('../lib/state');

exports.anchorName = anchorName;
exports.getFile = getFile;
exports.getImport = getImport;
exports.identifier = _identifier;
exports.inlineLinks = inlineLinks;
exports.isExportedTag = isExportedTag;
exports.isExportedTagExist = isExportedTagExist;
exports._link = _link;
exports.link = link;
exports.parseLink = parseLink;
exports.prepareHeader = prepareHeader;
exports.clearHeader = clearHeader;
exports.groupBy = groupBy;
exports._groupBy = _groupBy;
exports._addGroup = _addGroup;
exports._children = _children;
exports.printDescription = printDescription;

function deepEqual(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

function getImport(obj) {
	if (!obj || !obj.meta || !global.packageName) {
		return undefined;
	}

	const path = obj.meta.path;
	const executionPath = process.cwd();

	return `${global.packageName}${path.replace(executionPath, '')}/${obj.meta.filename.replace('.js', '')}`;
}

function getFile(obj) {
	if (!obj || !obj.meta || !global.packageName) {
		return undefined;
	}

	const path = obj.meta.path;
	const executionPath = process.cwd();

	return `${path.replace(executionPath, '')}/${obj.meta.filename}`;
}

function prepareHeader(header) {
	return header.replace(/([#.+\s])/g, '').toLocaleLowerCase();
}

function clearHeader(identifier) {
	let header = identifier.longname;
	if (header) {
		header = header.replace(/([#.+\s])/g, '').toLocaleLowerCase();

		if (identifier.kind === 'constructor') {
			header = 'new_' + header + '_new';
		}
	}

	return header;
}

function link(longname, options) {
	return options.fn(_link(longname, options));
}

function _link(input, options) {
	if (typeof input !== 'string') return null;
	let linked, matches, namepath;
	let output = {};

	/*
	test input for
	1. A type expression containing a namepath, e.g. Array.<module:Something>
	2. a namepath referencing an `id`
	3. a namepath referencing a `longname`
	*/
	const regexPattern = /.*?<(.*)>/;
	if ((matches = input.match(regexPattern))) {
		namepath = matches[1];
		while ((matches = namepath.match(regexPattern))) {
			namepath = matches[1];
		}
	} else {
		namepath = input;
	}

	options.hash = { id: namepath };
	linked = _identifier(options);
	if (!linked) {
		options.hash = { longname: namepath };
		linked = _identifier(options);
	}
	if (!linked) {
		output = { name: input, url: null };
		if (global.pathById[input]) {
			output.url = `${global.pathById[input]}?id=${input.replace(/[#.\s]/g, '').toLowerCase()}`;
		} else {
			if (global.pathById[namepath]) {
				output.url = `${global.pathById[namepath]}?id=${namepath.replace(/[#.\s]/g, '').toLowerCase()}`;
			}
		}
	} else {
		if (linked.ignore) {
			return { name: input, url: null };
		}

		if (global.pathById) {
			if (!global.pathById[linked.memberof]) {
				if (global.pathById[linked.longname]) {
					output.url = `${global.pathById[linked.longname]}?id=${linked.longname.replace(/[#.\s]/g, '').toLowerCase()}`;
				} else {
					return { name: input, url: null };
				}
			}
		}

		output.name = input.replace(namepath, linked.name);
		if (isExternal.call(linked)) {
			if (linked.description) {
				output.url = '#' + anchorName.call(linked, options);
			} else {
				if (linked.see && linked.see.length) {
					const firstLink = parseLink(linked.see[0])[0];
					output.url = firstLink ? firstLink.url : linked.see[0];
				} else {
					output.url = null;
				}
			}
		} else {
			output.url = '#' + anchorName.call(linked, options);
		}
	}

	return output;
}

function isExternal() {
	return this.kind === 'external';
}

function _identifiers(options) {
	const query = {};

	for (const prop in options.hash) {
		if (/^-/.test(prop)) {
			query[prop.replace(/^-/, '!')] = options.hash[prop];
		} else if (/^_/.test(prop)) {
			query[prop.replace(/^_/, '')] = new RegExp(options.hash[prop]);
		} else {
			query[prop] = options.hash[prop];
		}
	}

	return arrayify(options.data.root)
	.filter(where(query))
	.filter(function(doclet) {
		return !doclet.ignore && (state.options.private ? true : doclet.access !== 'private');
	});
}

function _identifier(options) {
	return _identifiers(options)[0];
}

function isExportedTagExist(customTags = []) {
	return !!customTags.find(({ tag }) => isExportedTag(tag));
}

function isExportedTag(tag) {
	return tag === 'exported';
}

function anchorName(options) {
	if (!this.id) throw new Error('[anchorName helper] cannot create a link without a id: ' + JSON.stringify(this));
	if (this.inherited) {
		options.hash.id = this.inherits;
		const inherits = _identifier(options);
		if (inherits) {
			if (global.pathById) {
				if (global.pathById[inherits.memberof]) {
					if (!inherits.ignore) {
						return anchorName.call(inherits, options);
					}
				}
			} else {
				return anchorName.call(inherits, options);
			}
		} else {
			return '';
		}
	}

	return util.format(
		'%s%s%s',
		this.isExported ? 'exp_' : '',
		this.kind === 'constructor' ? 'new_' : '',
		this.id
		.replace(/:/g, '_')
		.replace(/~/g, '..')
		.replace(/\(\)/g, '_new')
		.replace(/#/g, '')
		.replace(/\./g, '')
	);
}

function parseLink(text) {
	if (!text) return '';
	const results = [];
	const link1 = /{@link\s+([^\s}|]+?)\s*}/g; // {@link someSymbol}
	const link2 = /\[([^\]]+?)\]{@link\s+([^\s}|]+?)\s*}/g; // [caption here]{@link someSymbol}
	const link3 = /{@link\s+([^\s}|]+?)\s*\|([^}]+?)}/g; // {@link someSymbol|caption here}
	const link4 = /{@link\s+([^\s}|]+?)\s+([^}|]+?)}/g; // {@link someSymbol Caption Here}
	let matches = null;

	while ((matches = link4.exec(text)) !== null) {
		results.push({
			original: matches[0],
			caption: matches[2],
			url: matches[1]
		});
		text = text.replace(matches[0], ' '.repeat(matches[0].length));
	}

	while ((matches = link3.exec(text)) !== null) {
		results.push({
			original: matches[0],
			caption: matches[2],
			url: matches[1]
		});
		text = text.replace(matches[0], ' '.repeat(matches[0].length));
	}

	while ((matches = link2.exec(text)) !== null) {
		results.push({
			original: matches[0],
			caption: matches[1],
			url: matches[2]
		});
		text = text.replace(matches[0], ' '.repeat(matches[0].length));
	}

	while ((matches = link1.exec(text)) !== null) {
		results.push({
			original: matches[0],
			caption: matches[1],
			url: matches[1]
		});
		text = text.replace(matches[0], ' '.repeat(matches[0].length));
	}

	return results;
}

function inlineLinks(text, options) {
	if (text) {
		const links = parseLink(text);
		links.forEach(function(link) {
			const linked = _link(link.url, options);
			if (link.caption === link.url) link.caption = linked.name;
			if (linked.url) link.url = linked.url;

			if (global.pathById) {
				const pathToFile = global.pathById[link.caption];
				if (pathToFile) {
					if (!link.url.includes(pathToFile)) {
						link.url = `${pathToFile}?id=${prepareHeader(link.url)}`;
					}
				} else {
					link.url = `#${link.url.replace(/[#.\s]/g, '').toLowerCase()}`;
				}
			}
			text = text.replace(link.original, '[' + link.caption + '](' + link.url + ')');
		});
	}

	return text;
}

function _groupBy(identifiers, groupByFields) {
	/* don't modify the input array */
	groupByFields = groupByFields.slice(0);

	groupByFields.forEach(function(group) {
		const groupValues = identifiers
		.filter(function(identifier) {
			/* exclude constructors from grouping.. re-implement to work off a `null` group value */
			return identifier.kind !== 'constructor';
		})
		.map(function(i) {
			return i[group];
		})
		.reduce(unique, []);
		if (groupValues.length <= 0) groupByFields = groupByFields.reduce(without(group), []);
	});
	identifiers = _addGroup(identifiers, groupByFields);

	const inserts = [];
	let prevGroup = [];
	let level = 0;
	identifiers.forEach(function(identifier, index) {
		if (!deepEqual(identifier._group, prevGroup)) {
			const common = commonSequence(identifier._group, prevGroup);
			level = common.length;
			identifier._group.forEach(function(group, i) {
				if (group !== common[i] && group !== null) {
					inserts.push({
						index: index,
						_title: group,
						level: level++
					});
				}
			});
		}
		identifier.level = level;
		prevGroup = identifier._group;
		delete identifier._group;
	});

	/* insert title items */
	inserts.reverse().forEach(function(insert) {
		identifiers.splice(insert.index, 0, { _title: insert._title, level: insert.level });
	});

	return identifiers;
}

function groupBy(groupByFields, options) {
	groupByFields = arrayify(groupByFields);

	return handlebars.helpers.each(_groupChildren.call(this, groupByFields, options), options);
}

function _addGroup(identifiers, groupByFields) {
	return identifiers.map(function(identifier) {
		identifier._group = groupByFields.map(function(field) {
			return typeof identifier[field] === 'undefined' ? null : identifier[field];
		});

		return identifier;
	});
}

function _groupChildren(groupByFields, options) {
	const children = _children.call(this, options);

	return _groupBy(children, groupByFields);
}

function _children(options) {
	if (!this.id) return [];
	const min = options.hash.min;
	delete options.hash.min;
	options.hash.memberof = this.id;
	let output = _identifiers(options);
	output = output.filter(function(identifier) {
		if (identifier.kind === 'external') {
			return identifier.description && identifier.description.length > 0;
		} else {
			return true;
		}
	});
	if (output.length >= (min || 0)) return output;
}

function printDescription(description) {
	if (typeof description !== 'string') {
		return undefined;
	}

	let lines = description
	.replace(/\n\r/g, '\n')
	.replace(/\r/g, '\n')
	.split(/\n/g);

	lines = lines.map((l) => `> ${l}`);

	return lines.join('\n');
}
