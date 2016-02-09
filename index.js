require('marko/node-require').install()

var Cornerstone = require('./src/cornerstone')
var EditableType = require('./src/editable-type')
var Collection = require('./src/collection')
/*
var FieldType = require('./src/field-type')
*/

module.exports = new Cornerstone()
module.exports.Cornerstone = Cornerstone
module.exports.EditableType = EditableType
module.exports.Collection = Collection
/*
module.exports.FieldType = FieldType
*/