module.exports = {
	actions: {
		edit: {
			label:'Edit link destination',
			icon:'link',
			fn:(element, value, options, done) => {

			},
		},
		visit: {
			label:'Visit link',
			icon:'launch',
			fn:(element, value, options, done) => {
				window.location.href = value
			},
		}
	},
	parse: (element) => {
		return element.getAttribute('href')
	},
	render: (node, value, options) => {
		if(value) {
			node.href = value
		}

		return node
	}
}