module.exports = function(el, context) {
	var builder = context.builder
	var injectNode = context.createNodeForEl('inject')

	injectNode.setAttributeValue('resource', '"js"')
	el.appendChild(injectNode)
}