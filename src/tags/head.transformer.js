module.exports = function(el, context) {
	var builder = context.builder
	var injectNode = context.createNodeForEl('inject')

	injectNode.setAttributeValue('resource', '"css"')
	el.appendChild(injectNode)
}