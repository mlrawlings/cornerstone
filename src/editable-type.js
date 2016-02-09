'use strict'

class EditableType {
	constructor(name, data) {
		this.name = name
		this.actions = data.actions
		this.render = data.render
	}
}

module.exports = EditableType