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

		this.adminPath = 'admin'

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
	getCollection(name) {
		return this._collections[name]
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
		var adminRegex = new RegExp('^\\/'+this.adminPath+'(\/|$)')
		var serveStatic = getStaticMiddleware(this)
		var servePage = getPageMiddleware(this)
		return (req, res, next) => {
			if(adminRegex.test(req.path)) {
				req.url = req.url.replace(adminRegex, '/')
				req.editing = true
				serveStatic(req, res, () => servePage(req, res, next))
			} else {
				servePage(req, res, next)
			}
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

function getStaticMiddleware(cornerstone) {
	var publicPath = path.join(__dirname, './admin/public')
	return require('serve-static')(publicPath)
}

function getPageMiddleware(cornerstone) {
	var site
	return (req, res, next) => {
		Pages.model.findOne({ path:req.path }, (err, page) => {
			if(err) return next(err)
			if(!page) return next()
			
			var template = cornerstone.getTemplate(page.template)
			var $global = { site, page, editing:req.editing, qs:req.query }

			if($global.editing) {
				$global.inject = {
					css:[`/${cornerstone.adminPath}/editing.css`],
					js:[`/${cornerstone.adminPath}/editing.js`]
				}
			}
			
			template.stream({ $global }).pipe(res)
		})
	}
}