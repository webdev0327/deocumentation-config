const BasicNode = require('./BasicNode');

module.exports = (() => {
	class NodeText extends BasicNode {
		constructor(children, text) {
			super(children, text);
		}
		
		process() {
			return this._children.reduce((line, child) => {
				return line + child.process();
			}, `${this._text}`);
		}
	}

	return NodeText;
})();