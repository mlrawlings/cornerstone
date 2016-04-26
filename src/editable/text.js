module.exports = {
	actions: {
		edit: {
			label:'Edit text',
			icon:'edit',
			fn:(element, value, options, done) => {

			},
		}
	},
	parse: (element) => {
		return element.innerHTML
	},
	render: (node, value, options) => {
		if(value) {
			node.innerHTML = value
		}

		return node
	}
}
