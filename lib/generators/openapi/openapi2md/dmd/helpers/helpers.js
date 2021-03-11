const objectGet = require('object-get');
const safejson = require('fast-safe-stringify');
const TurndownService = require('turndown');

const openAPIHelper = require('./openApiHelper');

exports.showMainIndex = showMainIndex;
exports.isServersExist = isServersExist;
exports.isPathsExist = isPathsExist;
exports.isParametersExist = isParametersExist;
exports.isComponentsExist = isComponentsExist;
exports.isRootExist = isRootExist;
exports.isSchema = isSchema;
exports.isResponse = isResponse;
exports.isParameters = isParameters;
exports.isComponentExist = isComponentExist;
exports.isSecuritySchemes = isSecuritySchemes;
exports.isTryMe = isTryMe;
exports.log = log;
exports.ifComponentsExist = ifComponentsExist;

exports.option = option;
exports.withData = withData;
exports.withTOCContent = withTOCContent;
exports.withInfo = withInfo;
exports.withPaths = withPaths;
exports.withServers = withServers;
exports.withComponents = withComponents;
exports.getParameters = getParameters;
exports.getResponses = getResponses;
exports.getResponse = getResponse;
exports.getRequestBody = getRequestBody;
exports.getValueFromObject = getValueFromObject;
exports.getSecurity = getSecurity;
exports.getSchema = getSchema;
exports.getPathLink = getPathLink;
exports.getFileExtension = getFileExtension;
exports.getFilename = getFilename;
exports.parameterToParametersArray = parameterToParametersArray;

exports.toUpperCase = toUpperCase;
exports.toTitleCase = toTitleCase;
exports.toLowerCase = toLowerCase;
exports.repeatSymbol = repeatSymbol;

// returns data

const contentLink = '/content/api/components?id=';

function convertToMD(str) {
	if (typeof str === 'string') {
		const updatedString = str.replace(/\n/g, '<br>');
		const turndownService = new TurndownService();

		return turndownService.turndown(updatedString).replace(/\n/g, '<br>').replace(/ {2}/g, '');
	} else {
		return str;
	}
}

function withData(options) {
	return options.fn(options.data.root[0]);
}

function withPaths(options) {
	const data = options.data.root[0];
	let context = [];
	if (isPathsExist(options)) {
		context = Object.keys(data.paths).map((key) => {
			const path = data.paths[key];
			const pathObj = {};

			pathObj.path = key;
			pathObj.verbs = Object.keys(path).map((verb) => {
				return { verb, data: path[verb] };
			});

			return pathObj;
		});
	}

	return options.fn(context);
}

function withComponents(options) {
	const data = options.data.root[0];
	const context = [];
	if (isComponentsExist(options)) {
		if (data.components['responses']) {
			const component = data.components['responses'];
			const compObj = {};

			compObj.title = 'Responses';
			compObj.data = component;
			context.push(compObj);
		}

		if (data.components['schemas']) {
			const component = data.components['schemas'];
			const compObj = {};

			compObj.title = 'Schemas';
			compObj.data = component;
			context.push(compObj);
		}

		if (data.components['securitySchemes']) {
			const component = data.components['securitySchemes'];
			const compObj = {};

			compObj.title = 'Security';
			compObj.data = component;
			context.push(compObj);
		}

		if (data.components['parameters']) {
			const component = data.components['parameters'];
			const compObj = {};

			compObj.title = 'Parameters';
			compObj.data = component;
			context.push(compObj);
		}
	}

	return options.fn(context);
}

function withTOCContent(options) {
	const data = options.data.root[0];
	const context = [];

	if (data.servers) context.push('Servers');
	if (data.components) context.push('Components');
	if (data.paths) context.push('Paths');

	return options.fn(context);
}

function withInfo(options) {
	const data = options.data.root[0];

	return options.fn(data.info);
}

function withServers(options) {
	const data = options.data.root[0];
	let context = [];

	if (isServersExist(options)) {
		context = data.servers;
	}

	return options.fn(context);
}

function option(name, options) {
	return objectGet(options.data.root.options, name);
}

// returns bool

function isSchema(key) {
	return key === 'Schemas';
}

function isSecuritySchemes(key) {
	return key === 'Security';
}

function isResponse(key) {
	return key === 'Responses';
}

function isParameters(key) {
	return key === 'Parameters';
}

function isComponentExist(params) {
	if (typeof params === 'object') {
		return Object.keys(params).length > 0;
	}
	
	return false;
}

function isServersExist(options) {
	const data = options.data.root[0];

	return data.servers && data.servers.length;
}

function isPathsExist(options) {
	const data = options.data.root[0];

	return data.paths && Object.keys(data.paths).length;
}

function isComponentsExist(options) {
	const data = options.data.root[0];

	return data.components && Object.keys(data.components).length;
}

function ifComponentsExist(options) {
	const data = options[0];

	return data.components && Object.keys(data.components).length;
}

function showMainIndex(options) {
	const data = options.data.root[0];
	if (data) {
		if (data.server || data.paths) {
			return true;
		}
	}

	return false;
}

function isParametersExist(params) {
	return !!params.data.length;
}

function isRootExist(params) {
	return !!params.root && !!params.root.type;
}

function repeatSymbol(context) {
	const symbol = context.hash.symbol;
	const count = context.hash.count;

	if (!symbol || !count) {
		return;
	}

	return symbol.repeat(count);
}

function getValueFromObject(context) {
	const obj = context.hash.object;
	const key = context.hash.key;

	if (typeof obj !== 'object') {
		return;
	}

	return obj[key];
}

// manipulations

function toUpperCase(str) {
	return str.toUpperCase();
}

function toLowerCase(str) {
	return str.toLowerCase();
}

function toTitleCase(str) {
	if (!str) {
		return '';
	}
	
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function getParameters(parameters, opt) {
	const context = {};
	const api = opt.data.root[0];
	const headers = [
		{ title: 'name', length: 4 },
		{ title: 'type', length: 4 },
		{ title: 'required', length: 8 },
		{ title: 'nullable', length: 8 },
		{ title: 'description', length: 11 }
	];
	context.headerParameters = {
		headers: headers,
		data: []
	};
	context.queryString = { headers: [...headers], data: [] };
	context.pathParameters = { headers: [...headers], data: [] };
	context.cookieParameters = { headers: [...headers], data: [] };
	context.refParameters = { data: [] };

	for (const param of parameters) {
		const parsedParameter = parseParameter(param, api);
		
		if (parsedParameter.$ref) {
			context.refParameters.data.push(parsedParameter);
		} 
		
		if (parsedParameter.in === 'cookie') {
			context.cookieParameters.data.push(parsedParameter);
		}
		if (parsedParameter.in === 'header') {
			context.headerParameters.data.push(parsedParameter);
		}
		if (parsedParameter.in === 'path') {
			context.pathParameters.data.push(parsedParameter);
		}
		if (parsedParameter.in === 'query') {
			context.queryString.data.push(parsedParameter);
		}
	}

	return opt.fn(context);
}

function parseParameter(parameter, api) {
	const param = Object.assign({}, parameter);
	const ref = param.$ref;
	const options = { sample: true };

	if (ref) {
		const link = ref
			.replace('#/components/', '')
			.replace(/\//g, '')
			.toLowerCase();
		const name = ref.replace('#/components/parameters/', '');

		param.link = `[${name}](#${link})`;
		param.oLink = `[${name}](/content/api/components?id=${link})`;


	} else {
		param.exampleValues = {};
		param.nullable = !!param.nullable;
		if (!param.required) param.required = false;
		let paramSchema = param.schema;
		if (!paramSchema && param.content) {
			paramSchema = Object.values(param.content)[0].schema;
		}
		if (paramSchema && !param.safeType) {
			param.type = paramSchema.type;
			param.safeType = paramSchema.type || inferType(paramSchema);
			if (paramSchema.format) {
				param.safeType = param.safeType + '(' + paramSchema.format + ')';
			}
			if (paramSchema.format) {
				param.safeType = param.safeType + '(' + paramSchema.format + ')';
			}
			if (param.safeType === 'Array' && paramSchema.items) {
				let itemsType = paramSchema.items.type;
				if (!itemsType) {
					itemsType = inferType(paramSchema.items);
				}
				param.safeType = 'Array&lt;' + itemsType + '&gt;';
			}
			if (param.$ref) param.safeType = '[' + param.$ref + '](#schema' + param.$ref.toLowerCase() + ')';
		}

		if (paramSchema) {
			param.exampleValues.object = param.example || param.default || openAPIHelper.getSample(paramSchema, options, { skipReadOnly: true, quiet: true }, api);
			if (typeof param.exampleValues.object === 'object') {
				param.exampleValues.json = safejson(param.exampleValues.object, null, 2);
			} else {
				param.exampleValues.json = '\'' + param.exampleValues.object + '\'';
			}
		}
		if (param.description === 'undefined') {
			param.description = '';
		}
		if (typeof param.description !== 'undefined' && typeof param.description === 'string') {
			param.shortDesc = param.description.split('\n')[0];
		}
		param.type = `<code>${toTitleCase(param.type)}</code>`;

		if (param.exampleValues.json) {
			param.example = param.exampleValues.json.replace(/\n/gm, '<br>');
		}

		if (param.description) {
			param.description = param.description.replace(/\n/gm, '<br>');
			param.description = convertToMD(param.description);
		}
	}

	return param;
}

function parameterToParametersArray(parameter) {
	return {
		parameters: [parameter]
	};
}

function getResponses(res, isCustomHeader, opt) {
	if (typeof isCustomHeader === 'object') {
		opt = isCustomHeader;
		isCustomHeader = false;
	}

	const context = [];
	const api = opt.data.root[0];

	Object.keys(res).forEach((code) => {
		const response = res[code];
		const entry = _getResponse(response, code, api, isCustomHeader);

		context.push(entry);
	});

	return opt.fn(context);
}

function _getResponse(response, code, api, isCustomHeader = false) {
	const options = { sample: true };
	const context = {};
	const headers = [
		{ title: 'name', length: 4 },
		{ title: 'type', length: 4 },
		{ title: 'description', length: 11 },
		{ title: 'required', length: 8 },
		{ title: 'example', length: 7 }
	];
	const ref = response.$ref;
	context.headers = { headers: [...headers], data: [] };
	context.description = typeof response.description === 'string' ? convertToMD(response.description.trim()) : undefined;
	context.content = {};
	context.status = code;

	if (ref) {
		const link = ref
			.replace('#/components/', '')
			.replace(/\//g, '')
			.toLowerCase();
		const name = ref.replace('#/components/responses/', '');

		context.link = `[${name}](#${link})`;
		context.oLink = `[${name}](/content/api/components?id=${link})`;

	} else {
		if (response.content) {
			Object.keys(response.content).forEach((ct) => {
				const contentType = response.content[ct];

				if (contentType.schema && contentType.schema.type && contentType.schema.type !== 'object' && contentType.schema.type !== 'array') {
					context.schemaType = contentType.schema.type;
				}

				context.content[ct] = resolveSchema(contentType.schema, api, isCustomHeader);
			});
		}

		if (response.headers) {
			Object.keys(response.headers).forEach((h) => {
				const header = response.headers[h];
				const entryHeader = {};
				const headerSchema = header.schema;
				entryHeader.exampleValues = {};
				entryHeader.name = h;
				entryHeader.description = convertToMD(header.description);
				entryHeader.required = header.required;
				entryHeader.schema = header.schema || {};
				entryHeader.type = toTitleCase(entryHeader.schema.type);
				entryHeader.format = entryHeader.schema.format;

				if (headerSchema) {
					entryHeader.exampleValues.object = entryHeader.example || entryHeader.default || openAPIHelper.getSample(headerSchema, options, { skipReadOnly: true, quiet: true }, api);

					if (typeof entryHeader.exampleValues.object === 'object') {
						entryHeader.exampleValues.json = safejson(entryHeader.exampleValues.object, null, 2);
					} else {
						entryHeader.exampleValues.json = '\'' + entryHeader.exampleValues.object + '\'';
					}

					entryHeader.example = entryHeader.exampleValues.json.replace(/\n/gm, '<br>');
					if (entryHeader.description) entryHeader.description = convertToMD(entryHeader.description.replace(/\n/gm, '<br>'));
				}

				entryHeader.type = toTitleCase(entryHeader.type);

				context.headers.data.push(entryHeader);
			});
		}
	}

	return context;
}

function getResponse(response, isCustomHeader, opt) {
	if (typeof isCustomHeader === 'object') {
		opt = isCustomHeader;
		isCustomHeader = false;
	}
	const api = opt.data.root[0];
	const context = _getResponse(response, undefined, api, isCustomHeader);

	return opt.fn(context);
}

function getRequestBody(req, isCustomHeader, opt) {
	if (typeof isCustomHeader === 'object') {
		opt = isCustomHeader;
		isCustomHeader = false;
	}

	const context = {};
	const api = opt.data.root[0];
	const contents = req.content;

	Object.keys(contents).forEach((ct) => {
		const content = contents[ct];
		context[ct] = resolveSchema(content.schema, api, isCustomHeader);
	});

	return opt.fn(context);
}

function resolveSchema(schema, api, isCustomHeader) {
	const context = {
		headers: [
			{ title: 'name', length: 4 },
			{ title: 'type', length: 4 },
			{ title: 'required', length: 8 },
			{ title: 'nullable', length: 8 },
			{ title: 'description', length: 11 }
		],
		data: [],
		root: {}
	};
	const options = { sample: true };

	function parseSchema(sch, name = undefined, parent = undefined, skip = false) {
		let nameN = name;

		if (parent) {
			nameN = name.search(/(\[.])$/g) !== -1 ? `${parent}${name}` : `${parent}.${name}`;
		}

		switch (sch.type) {
		case 'object': {
			const ref = sch.$ref;

			if (ref) {
				const link = ref.replace('#/components/', '').replace(/\//g, '');
				const type = ref.replace('#/components/schemas/', '');
				const t = isCustomHeader ? `[<code>${type}</code>](${contentLink}${link})` : `[<code>${type}</code>](#${link})`;
				context.data.push({
					name: nameN,
					description: convertToMD(sch.description),
					required: sch.required,
					type: t,
					nullable: !!sch.nullable
				});
			} else {
				if (sch.properties) {
					const properties = sch.properties;

					if (sch.required && Array.isArray(sch.required)) {
						Object.keys(properties).forEach((key) => {
							if (sch.required && sch.required.includes(key)) {
								properties[key].required = true;
							}
						});
						

						sch.required = undefined;
					}

					if (!skip) {
						context.data.push({
							name: nameN,
							description: convertToMD(sch.description),
							required: sch.required,
							type: `<code>${toTitleCase(sch.type)}</code>`,
							example: sch.example,
							nullable: !!sch.nullable
						});
					}

					Object.keys(properties).forEach((key) => {
						parseSchema(properties[key], key, nameN);
					});
				} else {
					context.data.push({
						name: nameN,
						description: convertToMD(sch.description),
						type: `<code>${toTitleCase(sch.type)}</code>`,
						example: sch.example,
						required: !!sch.required,
						nullable: !!sch.nullable
					});
				}
			}

			break;
		}

		case 'array': {
			const items = sch.items;
			if (items) {
				const ref = items.$ref;

				if (ref) {
					const link = ref.replace('#/components/', '').replace(/\//g, '');
					const type = ref.replace('#/components/schemas/', '');
					const t = isCustomHeader ? `[<code>Array&lt;${type}&gt;</code>](${contentLink}${link})` : `[<code>Array&lt;${type}&gt;</code>](#${link})`;

					context.data.push({
						name: nameN,
						description: convertToMD(sch.description),
						required: sch.required,
						type: t,
						nullable: !!sch.nullable
					});
				} else {
					let type = toTitleCase(sch.type);

					if (items.type && items.type === 'object') {
						type = 'Array&lt;object&gt;';
					}

					if (items.type && items.type === 'array') {
						type = 'Array&lt;Array&gt;';
					}

					type = `<code>${type}</code>`;

					context.data.push({
						name: nameN,
						description: convertToMD(sch.description),
						type: type,
						required: !!sch.required,
						example: sch.example,
						nullable: !!sch.nullable
					});

					if (sch.items && sch.items.type) {
						parseSchema(items, '[i]', nameN, true);
					}
				}
			} else {
				context.data.push({
					name: nameN,
					description: convertToMD(sch.description),
					type: `<code>${toTitleCase(sch.type)}</code>`,
					required: sch.required,
					example: !!sch.example,
					nullable: !!sch.nullable
				});
			}

			break;
		}

		default: {
			const example = sch.example || openAPIHelper.getSample(sch, options, {}, api);
			const ref = sch.$ref;

			if (nameN && nameN.includes('[i][i]')) {
				nameN = nameN.replace('[i][i]', '[i][j]');
			}

			if (ref) {
				const link = ref.replace('#/components/', '').replace(/\//g, '');
				const type = ref.replace('#/components/schemas/', '');
				const t = isCustomHeader ? `[<code>${type}</code>](${contentLink}${link})` : `[<code>${type}</code>](#${link})`;

				context.data.push({
					name: nameN,
					description: convertToMD(sch.description),
					required: sch.required,
					type: t,
					nullable: !!sch.nullable
				});
			} else {
				context.data.push({
					name: nameN,
					description:  convertToMD(sch.description),
					type: `<code>${toTitleCase(sch.type)}</code>`,
					required: !!sch.required,
					example: example,
					nullable: !!sch.nullable
				});
			}
		}
		}
	}
	
	switch (schema.type) {
	case 'object': {
		const ref = schema.$ref;
		
		if (ref) {
			const link = ref.replace('#/components/', '').replace(/\//g, '');
			const type = ref.replace('#/components/schemas/', '');
			const t = isCustomHeader ? `[<code>${type}</code>](${contentLink}${link})` : `[<code>${type}</code>](#${link})`;

			context.root = {
				name: schema.name,
				description:  convertToMD(schema.description),
				type: t
			};
		} else {
			context.root = {
				description: schema.description,
				type: `<code>${toTitleCase(schema.type)}</code>`,
				example: schema.example
			};
			
			const properties = schema.properties;
			
			if (schema.required && Array.isArray(schema.required)) {
				Object.keys(properties).forEach((key) => {
					if (schema.required && schema.required.includes(key)) {
						properties[key].required = true;
					}
				});
			}

			if (properties) {
				Object.keys(properties).forEach((name) => {
					parseSchema(properties[name], name);
				});
			}
		}

		break;
	}

	case 'array': {
		const items = schema.items;
		const ref = schema.items.$ref;
		let type = toTitleCase(schema.type);
		let name;

		if (ref) {
			const link = ref.replace('#/components/', '').replace(/\//g, '');
			const type = ref.replace('#/components/schemas/', '');
			const t = isCustomHeader ? `[<code>Array&lt;${type}&gt;</code>](${contentLink}${link})` : `[<code>Array&lt;${type}&gt;</code>](#${link})`;

			context.root = {
				description: convertToMD(schema.description),
				type: t
			};
		} else {
			if (items.type && items.type === 'object') {
				type = 'Array&lt;Object&gt;';
			}

			if (items.type && items.type === 'array') {
				type = 'Array&lt;Array&gt;';
				name = '[i]';
			}

			type = `<code>${type}</code>`;

			context.root = {
				description: convertToMD(schema.description),
				type: type,
				example: schema.example
			};

			if (items) {
				parseSchema(items, name, undefined, true);
			}
		}
		break;
	}

	default: {
		const ref = schema.$ref;

		if (ref) {
			const link = ref.replace('#/components/', '').replace(/\//g, '');
			const type = ref.replace('#/components/schemas/', '');
			const t = isCustomHeader ? `[<code>Array&lt;${type}&gt;</code>](${contentLink}${link})` : `[<code>Array&lt;${type}&gt;</code>](#${link})`;
			context.root = {
				description: convertToMD(schema.description),
				type: t,
				example: schema.example
			};
		} else {
			context.root = {
				description: convertToMD(schema.description),
				type: `<code>${toTitleCase(schema.type)}</code>`,
				example: schema.example
			};
		}
	}
	}

	const example = openAPIHelper.getSample(schema, options, { skipReadOnly: true, quiet: true }, api);

	if (typeof example === 'object') {
		context.root.example = safejson(example, null, 2);
	} else {
		context.root.example = `'${example}'`;
	}

	return context;
}

function getSchema(schema, opt) {
	const api = opt.data.root[0];
	const context = resolveSchema(schema, api);

	return opt.fn(context);
}

function getSecurity(security, key, opt) {
	if (typeof key === 'object') {
		opt = key;
		key = '';
	}

	const idKey = toLowerCase(key);
	const api = opt.data.root[0];
	const server = api.servers ? api.servers[0] : null;
	const context = {
		description: '',
		type: security.type,
		in: null,
		header: null,
		queryString: null,
		cookie: null,
		urls: null,
		flows: null
	};
	const securityType = security.type;
	switch (securityType) {
	case 'http': {
		if (security.scheme === 'bearer') {
			context.type = `${context.type} ${security.scheme}`;
			context.description = convertToMD(security.description);
			context.header = {
				headers: [
					{ title: 'name', length: 4 },
					{ title: 'format', length: 6 },
					{ title: 'example', length: 7 }
				],
				data: [
					{
						name: 'Authorization',
						format: security.bearerFormat,
						example: 'Authorization: Bearer <code>&lt;Token&gt;</code>'
					}
				]
			};
		}

		if (security.scheme === 'basic') {
			context.type = `${context.type} ${security.scheme}`;
			context.description = convertToMD(security.description);
			context.header = {
				headers: [
					{ title: 'name', length: 4 },
					{ title: 'example', length: 7 }
				],
				data: [
					{
						name: 'Authorization',
						example: 'Authorization: Basic <code>&lt;Token&gt;</code>'
					}
				]
			};
		}
		break;
	}
	case 'apiKey': {
		const table = {
			headers: [
				{ title: 'name', length: 4 },
				{ title: 'example', length: 7 }
			],
			data: []
		};

		context.description = convertToMD(security.description);
		context.in = security.in ? toTitleCase(security.in) : null;

		switch (security.in) {
		case 'header': {
			table.data.push({
				name: security.name,
				example: '<code>&lt;api_key&gt;</code>'
			});

			context.header = table;
			break;
		}
		case 'query': {
			const data = {
				name: security.name,
				example: `<code>?${security.name}={api_key}</code>`
			};

			if (server && server.url) {
				data.example = `${server.url}?${security.name}={api_key}</code>`;
			}

			table.data.push(data);

			context.queryString = table;
			break;
		}
		case 'cookie': {
			table.data.push({
				name: security.name,
				example: '<code>&lt;api_key&gt;</code>'
			});

			context.cookie = table;
			break;
		}
		}
		break;
	}
	case 'openIdConnect': {
		context.description =  convertToMD(security.description);
		if (security.openIdConnectUrl) {
			const urls = [];
			urls.push({
				title: 'OpenID Connect URL',
				url: security.openIdConnectUrl
			});

			context.urls = urls;
		}
		break;
	}
	case 'oauth2': {
		context.description = convertToMD(security.description);
		const flows = security.flows;
		if (flows) {
			const flowsToAdd = [];
			Object.keys(flows).forEach((flowType) => {
				const flow = {
					scopes: {},
					id: ''
				};
				const flowData = flows[flowType];
				flow.id = `security${idKey}${toLowerCase(flowType)}`;
				flow.title = splitCamelCase(flowType);

				if (flowData.authorizationUrl) {
					flow.isURL = true;
					flow.authorizationUrl = flowData.authorizationUrl;
				}

				if (flowData.tokenUrl) {
					flow.isURL = true;
					flow.tokenUrl = flowData.tokenUrl;
				}

				if (flowData.refreshUrl) {
					flow.isURL = true;
					flow.refreshUrl = flowData.refreshUrl;
				}
				const scopesData = flowData.scopes;
				if (scopesData) {
					flow.scopes = [];
					Object.keys(scopesData).forEach((scopeName) => {
						flow.scopes.push({
							title: scopeName,
							description:  convertToMD(scopesData[scopeName])
						});
					});
				}

				flowsToAdd.push(flow);
			});

			context.flows = flowsToAdd;
		}
		break;
	}
	}

	return opt.fn(context);
}

function getPathLink(path) {
	return path.replace(/([{}\/])/g, '').replace(/\s/, '-');
}

function splitCamelCase(text) {
	const result = text.replace(/([A-Z])/g, ' $1');

	return result.charAt(0).toUpperCase() + result.slice(1);
}

function isTryMe(options) {
	return options.data.root.options.tryme;
}

function getFileExtension(options) {
	return options.data.root.options.fileExtension;
}

function getFilename(options) {
	return options.data.root.options.filename;
}

function log(item) {
	console.info(item);
}