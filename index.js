require('marko/node-require').install();
require('./test.marko').stream({ $global:{ page:{ data:{}}} }).pipe(process.stdout);