module.exports = function(elNode, generator) {
	if (!elNode.argument) {
        generator.addError('Invalid <register> tag. Argument is missing. Example: <register("my-id" as "My Display Name") />')
        return elNode
    }

    var builder = generator.builder
    var parts = elNode.argument.split(' as ')
    var id = parts[0].trim()
    var name = parts[1].trim()

    generator.addStaticVar('__exports', 'module.exports')
    generator.addStaticCode(builder.assignment('__exports.id', id))
    generator.addStaticCode(builder.assignment('__exports.name', name))
}