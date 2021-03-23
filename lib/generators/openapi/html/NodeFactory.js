const NodeBold = require('./node/NodeBold');
const NodeBr = require('./node/NodeBr');
const NodeItalic = require('./node/NodeItalic');
const NodeLink = require('./node/NodeLink');
const NodeText = require('./node/NodeText');

module.exports = (() => {
	class NodeFactory {

		/**
		 * Generates instance of {@link BasicNode} from the HTML Node.
		 *
		 * @param htmlNode
		 * @returns {BasicNode}
		 * @constructor
		 */
		static Parse(htmlNode) {
			if (htmlNode.type === 'tag') {
				const processFunc = tagsMap.get(htmlNode.name) || processDefault;

				return processFunc(htmlNode);
			} else if (htmlNode.type === 'text') {
				return processText(htmlNode);
			}
		}
	}

	function processDefault(htmlNode) {
		const children = htmlNode.children || [];

		const childrenNodes = children.map((child) => NodeFactory.Parse(child));

		return new NodeText(childrenNodes, `<${htmlNode.name}>`);
	}

	function processText(htmlNode) {
		const children = htmlNode.children || [];

		const childrenNodes = children.map((child) => NodeFactory.Parse(child));

		return new NodeText(childrenNodes, htmlNode.data);
	}

	function processTagA(htmlNode) {
		const childrenNode = htmlNode.children[0];
		let href = '#';

		if (htmlNode.attribs && htmlNode.attribs.href) {
			href = htmlNode.attribs.href;
		}

		return new NodeLink([NodeFactory.Parse(childrenNode)], href);
	}

	function processTagB(htmlNode) {
		const children = htmlNode.children || [];

		const childrenNodes = children.map((child) => NodeFactory.Parse(child));

		return new NodeBold(childrenNodes, '');
	}

	function processTagI(htmlNode) {
		const children = htmlNode.children || [];

		const childrenNodes = children.map((child) => NodeFactory.Parse(child));

		return new NodeItalic(childrenNodes, '');
	}

	function processBr() {
		return new NodeBr([], '');
	}

	const tagsMap = new Map();

	tagsMap.set('a', processTagA);
	tagsMap.set('b', processTagB);
	tagsMap.set('br', processBr);
	tagsMap.set('i', processTagI);

	return NodeFactory;
})();