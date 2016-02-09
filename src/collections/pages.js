var Collection = require('../collection')

module.exports = new Collection('Pages', {
	schema: {
		name:String,
		path:String,
		template:String,
		data:{}
	}
})