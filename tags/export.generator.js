module.exports = function(elNode, generator) {
	var attributes = elNode.attributes;

    if (!attributes) {
        generator.addError('Invalid <export> tag. Argument is missing. Example; <export x=123 />')
        return elNode
    }

    var builder = generator.builder

    generator.addStaticVar('__exports', 'module.exports')
    
	attributes.forEach((attr) => {
        generator.addStaticCode(builder.assignment('__exports.'+attr.name, attr.value))
    })
}