const BasicNode = require('./BasicNode');

module.exports = (() => {
	class NodeLink extends BasicNode {
		constructor(children, link) {
			const text = processChildren(children);
			
			super(children, text);
			
			this._link = link;
		}

		process() {
			return `[${this._text}](${this._link})`;
		}
	}
	
	function processChildren(children) {
		return children.reduce((line, child) => {
			return line + child.process();
		}, '');
	}

	return NodeLink;
})();