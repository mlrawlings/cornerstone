'use strict'

var path = require('path')
var all = require('require-all')
var mongoose = require('mongoose')

class Cornerstone {
	constructor() {
		this._templates = {}
		this._collections = {}
		this._editableTypes = {}

		this.loadEditableTypes(path.join(__dirname, './editable'))
	}
	registerTemplate(template) {
		if(!template.id) return
		this._templates[template.id] = template
	}
	loadTemplates(dirname) {
		this._load(dirname, this.registerTemplate)
	}
	registerCollection(collection) {
		this._collections[collection.name] = collection
	}
	loadCollections(dirname) {
		this._load(dirname, this.registerCollection)
	}
	registerEditableType(editable) {
		this._editableTypes[editable.name] = editable
	}
	loadEditableTypes(dirname) {
		this._load(dirname, this.registerEditableType)
	}
	connect() {
		mongoose.connect.apply(mongoose, arguments)
	}
	_load(dirname, fn) {
		all({
			dirname,
			resolve:fn.bind(this)
		})
	}
}

module.exports = Cornerstone