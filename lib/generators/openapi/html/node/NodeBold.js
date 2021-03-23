const BasicNode = require('./BasicNode');

module.exports = (() => {
	class NodeBold extends BasicNode {
		constructor(children, text) {
			super(children, text);
		}
		
		process() {
			const childrenText = this._children.reduce((line, child) => {
				return line + child.process();
			}, '');
			
			return `**${childrenText}**`;
		}
	}

	return NodeBold;
})();