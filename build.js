var fs = require('fs')
var path = require('path')
var mkdir = require('mkdirp')
var cpdir = require('copy-dir')
var browserify = require('browserify')

var settings = getSettings()

var outputDir = path.join(__dirname, './generated')
var staticOutputDir = path.join(outputDir, './static')

var editableFile = path.join(outputDir, './editable.js')
var adminFile = path.join(staticOutputDir, './admin.js')

var adminEntryFile = path.join(__dirname, './src/admin/client.js')
var adminStaticPath = path.join(__dirname, './src/admin/static')

mkdir.sync(staticOutputDir)
cpdir.sync(adminStaticPath, staticOutputDir)
buildFile(editableFile, settings.editable)
browserify(adminEntryFile).bundle().pipe(fs.createWriteStream(adminFile))

function buildFile(file, paths) {
	var contents = 'module.exports = {\n'

	Object.keys(paths).forEach(function(name) {
		contents += `  ${name}:require('${escapeBackslashes(paths[name])}'),\n`
	})

	contents += '}'

	fs.writeFileSync(file, contents)
}

function escapeBackslashes(val) {
	return val.replace(/\\/g, '\\\\')
}

function getSettings() {
	var currentPath = __dirname
	var settings = require(path.join(currentPath, './cornerstone.json'))

	resolvePaths(settings.editable, currentPath)

	return settings
}

function resolvePaths(object, currentPath) {
	Object.keys(object).forEach(function(name) {
		object[name] = path.resolve(currentPath, object[name])
	})
}