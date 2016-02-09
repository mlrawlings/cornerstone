var express = require('express')
var cornerstone = require('../')
var app = express()

cornerstone.connect('mongodb://localhost/cornerstone-test')

app.use(cornerstone.express())

/* Start Temporary Init */

var Pages = cornerstone.Pages

Pages.model.find({}, function(err, pages) {
	if(pages && pages.length) return

	var page = new Pages.model({
		name:'Home',
		path:'/',
		template:'test-1',
		data:{
			'feature-link':{
				text:'This is a link',
				href:'https://google.com/'
			}
		}
	})

	page.save()
})

cornerstone.registerTemplate(require('./test.marko'))


/* End Temporary Init */

app.listen(8888)