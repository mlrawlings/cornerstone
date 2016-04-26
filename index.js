require('./build')
require('marko/node-require').install()

var Cornerstone = require('./src/cornerstone')
var Collection = require('./src/collection')
var Pages = require('./src/collections/pages')

module.exports = new Cornerstone()
module.exports.Cornerstone = Cornerstone
module.exports.Collection = Collection
module.exports.Pages = Pages