const cheerio = require('cheerio');

const NodeFactory = require('./NodeFactory');

module.exports = (() => {
	/**
	 * Parses HTML into markdown text.
	 */
	class HTMLParser {
		constructor() {
			this._root = null;
			this._input = null;
		}

		/**
		 * Parses HTML into markdown text.
		 * 
		 * @param {String} input - input HTML string
		 * @returns {String|null}
		 */
		parseFromString(input) {
			this._root = cheerio.load(withBarchartWrapper(input), {
				xmlMode: true
			});
			const rootNode = this._root('#barchart-root');
			
			if (rootNode.length > 0) {
				this._input = rootNode[0];

				return process(this._input);
			}

			return null;
		}
	}

	/**
	 * Process all children elements from the custom HTML element.
	 *
	 * @param root
	 * @returns {*}
	 */
	function process(root) {
		return root.children.reduce((text, htmlNode) => {
			const node = NodeFactory.Parse(htmlNode);

			if (!node) {
				return text;
			}
			
			return text + node.process();
		}, '');
	}

	/**
	 * Wraps input string into custom HTML element to make it easier to retrieve HTML data.
	 * @param input
	 * @returns {string}
	 */
	function withBarchartWrapper(input) {
		return `<x-barchart id="barchart-root">${input}</x-barchart>`;
	}

	return HTMLParser;
})();