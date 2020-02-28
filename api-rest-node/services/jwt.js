'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){
	// objeto con el que se va a generar el toker y se enviara al cliente
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, 'clave-secreta-genera-token-9999');
};