const circularClone = require('reftools/lib/clone.js').circularClone;
const recurse = require('reftools/lib/recurse.js').recurse;
const safejson = require('fast-safe-stringify');
const sampler = require('openapi-sampler');
const visit = require('reftools/lib/visit.js').visit;

exports.inferType = inferType;
exports.getSample = getSample;
exports.getSampleInner = getSampleInner;

function inferType(schema) {
	function has(properties) {
		for (const property of properties) {
			if (typeof schema[property] !== 'undefined') return true;
		}

		return false;
	}

	if (schema.type) return schema.type;
	const possibleTypes = [];
	if (
		has([
			'properties',
			'additionalProperties',
			'patternProperties',
			'minProperties',
			'maxProperties',
			'required',
			'dependencies'
		])
	) {
		possibleTypes.push('object');
	}
	if (has(['items', 'additionalItems', 'maxItems', 'minItems', 'uniqueItems'])) {
		possibleTypes.push('array');
	}
	if (has(['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf'])) {
		possibleTypes.push('number');
	}
	if (has(['maxLength', 'minLength', 'pattern'])) {
		possibleTypes.push('number');
	}
	if (schema.enum) {
		for (const value of schema.enum) {
			possibleTypes.push(typeof value); // doesn't matter about dupes
		}
	}

	if (possibleTypes.length === 1) return possibleTypes[0];

	return 'any';
}

function clean(obj) {
	if (typeof obj === 'undefined') return {};
	visit(
		obj,
		{},
		{
			filter: function(obj, key, state) {
				if (!key.startsWith('x-widdershins')) return obj[key];
			}
		}
	);

	return obj;
}

function strim(obj, maxDepth) {
	if (maxDepth <= 0) return obj;
	recurse(obj, { identityDetection: true }, function(obj, key, state) {
		if (state.depth >= maxDepth) {
			if (Array.isArray(state.parent[state.pkey])) {
				state.parent[state.pkey] = [];
			} else if (typeof state.parent[state.pkey] === 'object') {
				state.parent[state.pkey] = {};
			}
		}
	});

	return obj;
}

function getSample(orig, options, samplerOptions, api) {
	if (orig && orig.example) return orig.example;
	let result = getSampleInner(orig, options, samplerOptions, api);
	result = clean(result);
	result = strim(result, options.maxDepth);

	return result;
}

function getSampleInner(orig, options, samplerOptions, api) {
	let sample;
	if (!options.samplerErrors) options.samplerErrors = new Map();
	let obj = circularClone(orig);
	const defs = api;
	if (options.sample && obj) {
		try {
			sample = sampler.sample(obj, samplerOptions, defs); // was api
			if (sample && typeof sample.$ref !== 'undefined') {
				obj = JSON.parse(safejson(orig));
				sample = sampler.sample(obj, samplerOptions, defs);
			}
			if (typeof sample !== 'undefined') {
				if (sample !== null && Object.keys(sample).length) return sample;
				else {
					return sampler.sample({ type: 'object', properties: { anonymous: obj } }, samplerOptions, defs)
						.anonymous;
				}
			}
		} catch (ex) {
			if (options.samplerErrors.has(ex.message)) {
				process.stderr.write('.');
			} else {
				console.error('# sampler ' + ex.message);
				options.samplerErrors.set(ex.message, true);
				if (options.verbose) {
					console.error(ex);
				}
			}
			obj = JSON.parse(safejson(orig));
			try {
				sample = sampler.sample(obj, samplerOptions, defs);
				if (typeof sample !== 'undefined') return sample;
			} catch (ex) {
				if (options.samplerErrors.has(ex.message)) {
					process.stderr.write('.');
				} else {
					console.warn('# sampler 2nd error ' + ex.message);
					options.samplerErrors.set(ex.message, true);
				}
			}
		}
	}

	return obj;
}
