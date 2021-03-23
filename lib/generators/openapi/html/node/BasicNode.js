module.exports = (() => {
	class BasicNode {
		/**
		 * @constructor
		 * @param {[BasicNode]} children - nested Nodes.
		 * @param {String} text - text data from HTML Node. 
		 */
		constructor(children, text) {
			this._text = text || null;
			this._children = children || [];
		}

		/**
		 * Converts HTML Node into markdown string.
		 * 
		 * @returns {String}
		 */
		process() {
			return '';
		}
	}
	
	return BasicNode;
})();