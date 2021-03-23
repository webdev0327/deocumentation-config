const BasicNode = require('./BasicNode');

module.exports = (() => {
	class NodeBr extends BasicNode {
		constructor(children, text) {
			super(children, text);
		}
		
		process() {
			return '<br>';
		}
	}

	return NodeBr;
})();