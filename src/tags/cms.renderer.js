var editableTypes = require('../..')._editableTypes
var isOpenTagOnly = require('marko/node_modules/htmljs-parser/html-tags').isOpenTagOnly

module.exports = function(attributes, out) {
	var editing = out.global.qs.editing
	var editable = pluck(attributes, 'editable')
	var scope = pluck(attributes, 'scope') || 'page'

	attributes.innerHTML = pluck(attributes, 'renderBody')
	attributes.class = classStringToArray(attributes.class)
	attributes.style = styleStringToObject(attributes.style)

	attributes = applyEditables(attributes, editable, scope, out)

	var tag = pluck(attributes, 'tag')
	var innerHTML = pluck(attributes, 'innerHTML')

	attributes.class = classArrayToString(attributes.class)
	attributes.style = styleObjectToString(attributes.style)
	attributes['data-cms-editable'] = editing && JSON.stringify(editable)
	
	out.write(`<${tag}`)
	writeAttributes(attributes, out)
	out.write('>')

	if(!isOpenTagOnly(tag)) {
		writeInnerHTML(innerHTML, out)
		out.write(`</${tag}>`)
	}
}

function classStringToArray(classString) {
	return (classString || '').split(' ')
}

function classArrayToString(classArray) {
	return classArray.join(' ')
}

function styleStringToObject(styleString) {
	var styleObject = {}

	styleString && styleString.split(';').forEach(prop => {
		var parts = /^\s*([a-z-]+)\s*:\s*(.+?)\s*$/i.exec(prop)
		if(parts) {
			var name = parts[1]
			var value = parts[2]
			styleObject[name] = value
		}
	})

	return styleObject
}

function styleObjectToString(styleObject) {
	var styleString = ''

	Object.keys(styleObject).forEach(name => {
		styleString += `${name}:${styleObject[name]};`
	})

	return styleString
}

function applyEditables(attributes, editable, scopeName, out) {
	var global = out.global
	var scope = global && global[scopeName]
	var scopeData = scope && scope.data
	var tagData = scopeData && scopeData[attributes.id || attributes._id]

	Object.keys(editable).forEach(type => {
		if(!editableTypes[type]) {
			return out.error(type + ' is not registered as an editable type.')
		}

		var value = tagData && tagData[type]
		var options = editable[type]

		attributes = editableTypes[type].render(attributes, value, options)
	})

	return attributes
}

function writeAttributes(attributes, out) {
	Object.keys(attributes).forEach(attr => {
		var value = attributes[attr]
		if(value) {
			out.write(' ' + attr)
			if(value !== true) {
				out.write(`="${htmlStringify(value)}"`)
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

function htmlStringify(value) {
	return value.toString().replace(/"/g, '&quot;')
}