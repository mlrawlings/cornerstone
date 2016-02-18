var EditableType = require('../editable-type')

module.exports = new EditableType('href', {
	actions: [{
		label:'Edit link destination',
		icon:'link',
		fn:(element, value, options, update) => {

		},
	},{
		label:'Visit link',
		icon:'world',
		fn:(element, value, options, update) => {

		},
	}],
	render: (node, value, options) => {
		if(value) {
			node.href = value
		}

		return node
	}
})