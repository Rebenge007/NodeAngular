'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-genera-token-9999";

exports.authenticated = function (req, res, next) {
	// Comprobar si llega autorización
	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'La petición no tiene la cabecera de autorización !!!'
		})
	}

	// limpiar el token y qutar comillas
	var token = req.headers.authorization.replace(/['"]+/g,'');

	
	try{
		// Decodificar token 
		var payload = jwt.decode(token, secret);

		// comprobar expiración del token
  		if(payload.exp >= moment().unix()){
  			return res.status(404).send({
				message: 'El token ha expirado'
			})
		}

	}catch (ex){
		return res.status(404).send({
			message: 'El token no es valido'
		})
	}

	// adjuntar usuario identificado a la request
	req.user = payload;

	//Y pasar a la acción
	next();
}