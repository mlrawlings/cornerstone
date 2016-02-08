var cornerstone = require('../')
var template = require('./test.marko')
template.stream({ $global:{ page:{ data:{}}} }).pipe(process.stdout);