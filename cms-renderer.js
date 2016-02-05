var isOpenTagOnly = require('marko/node_modules/htmljs-parser/html-tags').isOpenTagOnly

module.exports = function render(attributes, out) {
	var editing = out.global.editing || true
	var editable = pluck(attributes, 'editable')
	var scope = pluck(attributes, 'scope') || 'page'

	attributes.innerHTML = pluck(attributes, 'renderBody')

	attributes = applyEditables(attributes, editable, scope, out)

	var tag = pluck(attributes, 'tag')
	var innerHTML = pluck(attributes, 'innerHTML')

	if(editing) {
		attributes['data-editable'] = JSON.stringify(editable)
	}
	
	out.write(`<${tag}`)
	writeAttributes(attributes, out)
	out.write('>')

	if(!isOpenTagOnly(tag)) {
		writeInnerHTML(innerHTML, out)
		out.write(`</${tag}>`)
	}
}

function applyEditables(attributes, editable, scope, out) {
	Object.keys(editable).forEach(type => {
		if(!editableTypes[type]) {
			throw new Error(type + ' is not registered as an editable type.')
		}

		var _global = out.global
		var _scope = global && global[scope]
		var _scopedata = _scope && _scope.data
		var _tagdata = _scopedata && _scopedata[attributes.id || attributes._id]
		var _value = _tagdata && _tagdata[type]

		attributes = editableTypes[type](attributes, _value, editable[type])
	})

	return attributes
}

function writeAttributes(attributes, out) {
	Object.keys(attributes).forEach(attr => {
		var value = attributes[attr]
		if(value) {
			out.write(' ' + attr)
			if(value !== true) {
				out.write(`="${value.toString()}"`)
			}
		}
	})
}

function writeInnerHTML(innerHTML, out) {
	if(typeof innerHTML === 'function') {
		innerHTML(out)
	} else if(typeof innerHTML === 'string') {
		out.write(innerHTML)
	}
}

function pluck(object, attr) {
	var value = object[attr]
	delete object[attr]
	return value
}

var editableTypes = {
	text:(attributes, value, options) => {
		attributes.contenteditable = false
		return attributes
	}
}