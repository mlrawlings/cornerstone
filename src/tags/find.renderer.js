var cornerstone = require('../..')

module.exports = function(input, out) {
	var Collection = cornerstone.getCollection(input.collection)
	var editing = out.global.qs.editing

	if(!Collection) {
		return out.error('No collection found with name "'+input.collection+'".')
	}
	
	out.flush()

	var asyncOut = out.beginAsync({ timeout:0 })
	var query
	var filter

	if(input.filter) {
		if(typeof input.filter === 'string') {
			if(filter = Collection.filters[input.filter]) {
				query = Collection.model.find(filter)
			} else {
				return out.error(input.collection+' collection does not have a filter named '+input.filter)
			}
		} else {
			query = Collection.model.find(input.filter)
		}
	} else {
		query = Collection.model.find()
	}

	if(input.skip) {
		query = query.skip(input.skip)
	}

	if(input.limit) {
		query = query.limit(input.limit)
	}

	if(input.sort) {
		query = query.sort(input.sort)
	}

	if(input.select) {
		query = query.select(input.select)
	}

	if(input.populate) {
		query = query.populate(input.populate)
	}

	var stream = query.stream()

	stream.on('data', result => {
		input.renderDocument(asyncOut, result, editing)
		asyncOut.flush()
	})
	stream.on('error', error => {
		asyncOut.error('An error occurred while retrieving data from the '+input.collection+' collection. '+error.toString())
	})
	stream.on('end', () => {
		asyncOut.end()
	})
}