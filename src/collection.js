'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

class Collection {
	constructor(name, data) {
		this.name = name
		this.schema = data.schema
		this.filters = data.filters || {}
		this.access = data.access || defaultAccess
		this.model = mongoose.model(name, new Schema(this.schema))
	}
}

function defaultAccess(user) {
	if(!user) return false
	return { create:true, read:true, update:true, delete:true }
}

module.exports = Collection