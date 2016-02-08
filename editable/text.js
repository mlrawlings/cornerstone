module.exports = {
	name:'text',
	actions: [{
		label:'Edit text',
		icon:'edit',
		fn:(element, value, options, update) => {

		},
	}],
	render: (node, value, options) => {
		node.innerHTML = value
		return node
	}
}
