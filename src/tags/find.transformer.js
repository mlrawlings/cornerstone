const HTML_ELEMENT = 'HtmlElement'

module.exports = function(el, context) {
	var builder = context.builder
	var parts = el.argument.split(' in ')
	var varName = parts[0].trim()
	var collectionName = parts[1].trim()
	var params = [builder.identifier('out'), builder.identifier(varName), builder.identifier('editing')]
	var renderDocument = builder.functionDeclaration('renderDocument', params, el.body)

	el.body.array.forEach(child => {
		if(child.type != HTML_ELEMENT) return

		child.setAttributeValue('data-cms-collection', 'editing && '+collectionName)
		child.setAttributeValue('data-cms-collection-id', 'editing && '+varName+'._id')
	})

	el.setAttributeValue('collection', collectionName)
	el.setAttributeValue('renderDocument', renderDocument)
	
	delete el.body
	delete el.argument
}