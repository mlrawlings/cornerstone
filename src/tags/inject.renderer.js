module.exports = function(input, out) {
	var global = out.global
	var inject = global && global.inject
	var type = input.resource
	var resources = (inject && inject[type]) || []
	var renderer = renderers[type]

	if(renderer) resources.forEach(resource => {
		out.write(renderer(resource))
	})
}

var renderers = {
	css: (href) => `<link rel="stylesheet" href="${href}" />`,
	js: (src) => `<script src="${src}"></script>`,
}