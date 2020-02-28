'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	image: String,
	role: String
});

// sirve para no tener que mostrar el password en las peticiones al objeto usuario
UserSchema.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;
	return obj;
}

module.exports = mongoose.model('User', UserSchema);
// lowercase y plurizar el nombre
// users sera el nombre de la coleccion de datos (schema)