'use strict'

var path = require('path')
var all = require('require-all')
var mongoose = require('mongoose')

var Pages = require('./collections/pages')

class Cornerstone {
	constructor() {
		this._templates = {}
		this._collections = {}
		this._editableTypes = {}

		this.registerCollection(Pages)
		this.loadEditableTypes(path.join(__dirname, './editable'))
	}
	getTemplate(id) {
		return this._templates[id]
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
	express() {
		var site
		return (req, res, next) => {
			Pages.model.findOne({ path:req.path }, (err, page) => {
				if(err) return next(err)
				if(!page) return next()
				
				var template = this.getTemplate(page.template)
				var $global = { site, page, qs:req.query }
				
				template.stream({ $global }).pipe(res)
			})
		}
	}
	_load(dirname, fn) {
		all({
			dirname,
			resolve:fn.bind(this)
		})
	}
}

module.exports = Cornerstone