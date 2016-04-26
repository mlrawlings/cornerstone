'use strict'

var path = require('path')
var all = require('require-all')
var mongoose = require('mongoose')

var Pages = require('./collections/pages')

class Cornerstone {
	constructor() {
		this._templates = {}
		this._collections = {}

		this.adminPath = 'admin'
		this.staticPath = 'static'

		this.registerCollection(Pages)
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
	connect() {
		mongoose.connect.apply(mongoose, arguments)
	}
	express() {
		var adminRegex = new RegExp('^\\/'+this.adminPath+'(\/|$)')
		var staticRegex = new RegExp('^\\/'+this.staticPath+'(\/|$)')
		var serveStatic = getStaticMiddleware(this)
		var servePage = getPageMiddleware(this)
		return (req, res, next) => {
			if(adminRegex.test(req.path)) {
				req.url = req.url.replace(adminRegex, '/')
				req.editing = true
				servePage(req, res, next)
			} else if(staticRegex.test(req.path)) {
				req.url = req.url.replace(staticRegex, '/')
				serveStatic(req, res, next)
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
	var staticPath = path.join(__dirname, '../generated/static')
	return require('serve-static')(staticPath)
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
					css:[`/${cornerstone.staticPath}/editing.css`],
					js:[`/${cornerstone.staticPath}/admin.js`]
				}
			}
			
			template.stream({ $global }).pipe(res)
		})
	}
}