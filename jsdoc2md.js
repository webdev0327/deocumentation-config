module.exports = {
	'source': {
		'includePattern': '(.+\\.ts(doc|x)?$)|(.+\\.js(doc|x)?$)',
		'excludePattern': '(.+\\.(test|spec).ts)|(node_modules/|docs)'
	},
	'plugins': [
		'plugins/markdown',
		'node_modules/jsdoc-babel'
	],
	'babel': {
		'extensions': ['ts', 'tsx'],
		'ignore': ['**/*.(test|spec).ts'],
		'babelrc': false,
		'presets': [
			[`${__dirname}/node_modules/@babel/preset-env`, { 'targets': { 'node': true } }],
			`${__dirname}/node_modules/@babel/preset-typescript`
		],
		'plugins': [
			`${__dirname}/node_modules/@babel/plugin-proposal-class-properties`,
			`${__dirname}/node_modules/@babel/plugin-proposal-object-rest-spread`
		]
	}
};