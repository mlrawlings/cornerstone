module.exports = function(el, context) {
	var builder = context.builder
	var parts = el.argument.split(' in ')
	var varName = parts[0].trim()
	var collectionName = parts[1].trim()
	var params = [builder.identifier('out'), builder.identifier(varName)]
	var renderDocument = builder.functionDeclaration('renderDocument', params, el.body)

	el.setAttributeValue('name', collectionName)
	el.setAttributeValue('renderDocument', renderDocument)
	
	delete el.body
	delete el.argument
}