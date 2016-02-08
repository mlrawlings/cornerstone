'use strict'

require('marko/node-require').install()

var all = require('require-all')

class Cornerstone {
	constructor() {
		this._editableTypes = {}
		this.loadEditableTypes(__dirname + '/editable')
	}
	registerEditableType(name, definition) {
		this._editableTypes[name] = definition
	}
	loadEditableTypes(dirname) {
		all({
			dirname,
			resolve:(editable) => {
				this.registerEditableType(editable.name, editable)
			}
		})
	}
}

module.exports = new Cornerstone()