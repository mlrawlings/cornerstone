const PROPERTY = 'Property'
const IDENTIFIER = 'Identifier'

module.exports = function transform(el, context) {
	if(el.tagName === 'cms') return;
	
	var builder = context.builder
	var editable = el.getAttributeValue('editable')
	var _id = el.getAttributeValue('_id')
	var id = el.getAttributeValue('id')
	var tag = el.tagName

	if(editable && editable.type === 'ObjectExpression') {
		if(!_id && !id) {
			context.addError(el, 'Editable <'+tag+'> is missing an id (or _id) attribute.')
			return
		}

		var cmsNode = context.createNodeForEl('cms', el.getAttributes())
		cmsNode.setAttributeValue('tag', '"'+tag+'"')
		cmsNode.getAttributeValue('editable').properties.forEach(property => {
			if(property.type !== PROPERTY) return
			if(property.value.type !== IDENTIFIER) return
			if(property.value.name !== property.key.name) return
			
			property.value = builder.literalTrue()
		})
		cmsNode.body = el.body
		el.replaceWith(cmsNode)
	}
}