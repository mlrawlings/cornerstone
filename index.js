require('marko/node-require').install()

var Cornerstone = require('./src/cornerstone')
var EditableType = require('./src/editable-type')
/*
var FieldType = require('./src/field-type')
var Collection = require('./src/collection')
*/

module.exports = new Cornerstone()
module.exports.Cornerstone = Cornerstone
module.exports.EditableType = EditableType
/*
module.exports.FieldType = FieldType
module.exports.Collection = Collection
*/