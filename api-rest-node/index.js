'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;
// 27017 puerto en el que correpor default la base de datos creada en mongoose
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true})
	.then(()=> {
		console.log('la conecxion a la base de datos de mongo se ha realizado correctamente !!!');
		// crear el servidor
		app.listen(port, ()=> {
			console.log('El Puerto de localhost 3999 funciona correctamente !!!');
		})
	})
	.catch( error => { console.log(error)});