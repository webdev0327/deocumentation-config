const BasicNode = require('./BasicNode');

module.exports = (() => {
	class NodeItalic extends BasicNode {
		constructor(children, text) {
			super(children, text);
		}
		
		process() {
			const childrenText = this._children.reduce((line, child) => {
				return line + child.process();
			}, '');
			
			return `*${childrenText}*`;
		}
	}

	return NodeItalic;
})();