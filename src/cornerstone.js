'use strict'

var path = require('path')
var all = require('require-all')

class Cornerstone {
	constructor() {
		this._editableTypes = {}
		this.loadEditableTypes(path.join(__dirname, './editable'))
	}
	registerEditableType(editable) {
		this._editableTypes[editable.name] = editable
	}
	loadEditableTypes(dirname) {
		this._load(dirname, this.registerEditableType)
	}
	registerTemplate(template) {
		if(!template.id) return
		this._templates[template.id] = template
	}
	loadTemplates(dirname) {
		this._load(dirname, this.registerTemplate)
	}
	_load(dirname, fn) {
		all({
			dirname,
			resolve:fn.bind(this)
		})
	}
}

module.exports = Cornerstone