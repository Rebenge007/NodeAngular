'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-node');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

var controller = {
	probando: function(req, res){
		return res.status(200).send({
			message: "Soye le método probando"
		});
	},

	testeando: function(req, res){
		return res.status(200).send({
			message: "Soye le método testeando"
		});
	},

	save: function(req, res){
		// Obtener los parametros de la petición
		var params = req.body;
		// validar los datos
		try{
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(err){
			return res.status(200).send({
				message: 'faltan datos por enviar save'
			});
		}

		// console.log( validate_name );
		// console.log( validate_surname );
		// console.log( validate_email );
		// console.log( validate_password );
		if(validate_name && validate_surname && validate_email && validate_password){
			// crear objeto de usuario
			var user = new User();

			// asignar valores al usuario(obj)
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.role = 'ROLE_USER';
			user.image = null;

			// comprobar si existe
			User.findOne({email: user.email}, (err, issetUser)=>{
				if(err){
					return res.status(500).send({
						message:'error al comprobar duplicidad del usuario'
					});
				}
				if(!issetUser){
					// si no existe 
					// cifrar contraseña 
					bcrypt.hash(params.password, null, null, (err, hash)=>{
						user.password = hash;
						// guardar
						user.save((err, userStore)=>{
							if(err){
								return res.status(500).send({
									message:'error al guardar el usuario'
								});
							}

							if(!userStore){
								return res.status(400).send({
									message:' el usuario no se guardo'
								});
							}

							// devolver respuesta
							return res.status(200).send({
								status: "success",
								user: userStore
							});
						}); // close save
					}); // close bcrypt

				}else{
					return res.status(500).send({
						message:'El usuario ya esta registrado'
					})
				}
			});

		}else{
			return res.status(200).send({
				message: "validación de los datos es incorrecta"
			});
		}

	},

	login: function(req, res){
		// recoger los parametros de la petición
		var params = req.body;

		// validar datos
		try{
			var validate_email = !validator.isEmpty(params.email) &&  validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(err){
			return res.status(200).send({
				message: 'faltan datos por enviar login'
			});
		}

		if(!validate_email || !validate_password){
			return res.status(200).send({
				message: 'datos incorrectos'
			});
		}

		// buscar usuarios que coincidad con el email
		User.findOne({email: params.email.toLowerCase()}, (err, user)=>{
			if(err){
				return res.status(500).send({
					message: 'Error al identificar al usuario'
				});
			}

			if(!user){
				return res.status(400).send({
					message: 'El usuario no existe'
				});
			}
			// si lo encuentra

			// comprobar la contraseña ( coincidencia de email y password / bcrypt)
			bcrypt.compare(params.password, user.password, (err, check)=>{
				// si es correcto
				if(check){
					// generar token de jwt y devolverlo
					if(params.gettoken){
						// devolver los datos
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						// limpiar el objeto
						user.password = undefined;

						// devolver los datos
						return res.status(200).send({
							message: "success login",
							user
						});
					}

					
				}else{
					return res.status(200).send({
						message: 'las credenciales no son correctas'
					})
				}

				
			});

			
		})

	},

	update: function(req, res){
		// middleware para comporbar el jwt, ponerselo a la ruta
		// recoger los datos del usuario
		var params = req.body;

		// validar los datos
		try{
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		}catch(err){
			return res.status(200).send({
				message: "Faltan datos por enviar update",
				params
			});
		}

		//eliminar propiedades innecesarias
		delete params.password;
		var userId = req.user.sub;

		// comprobar si el email es unico
		if(req.user.email != params.email){
			User.findOne({email: params.email.toLowerCase()}, (err, user)=>{
				if(err){
					return res.status(500).send({
						message: 'Error al inetenatar la identificación'
					})
				}

				if(user && user.email == params.email){
					return res.status(200).send({
						message: 'El email no puede ser modificado'
					});
				}else{
					// buscar y actualizar
					User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) =>{
						if(err){
							return res.status(500).send({
								status: "error",
								message: "Error al actualizar el usuario"
							});
						}

						if(!userUpdated){
							return res.status(500).send({
								status: "error",
								message: "No se ha actualizado el usuario"
							});
						}


						// devolver respuesta
						return res.status(200).send({
							status: "success",
							user: userUpdated
						});
					});
				}
			});
		}else{
			// buscar y actualizar
			User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) =>{
				if(err){
					return res.status(500).send({
						status: "error",
						message: "Error al actualizar el usuario"
					});
				}

				if(!userUpdated){
					return res.status(500).send({
						status: "error",
						message: "No se ha actualizado el usuario"
					});
				}


				// devolver respuesta
				return res.status(200).send({
					status: "success",
					user: userUpdated
				});
			});
		}


		
	},

	uploadAvatar: function(req, res){
		// Comprobar el modulo multiparty (md) routes/user.js

		//Recoger el fichero de la petición
		var fileName = 'Avatar No Subido ...';
		// req.files es el contenedor de la información relacionada al archivo que se quiere subir
		if(!req.files){
			//devolver respuesta
			return res.status(404).send({
				status: 'error',
				message: fileName
			})

		}

		//conseguir el nombre y la extencion del archivo
		var file_path = req.files.file0.path;
		var file_split = file_path.split('/');
		//warning en windows se usan las \\
		// var file_split = file_path.split('\\');
		var file_name = file_split.pop();
		var ext_split = file_name.split('\.');
		var file_ext = ext_split.pop();

		// comprobar extension (solo imagenes), si no es valida borrar archivo
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			fs.unlink(file_path, (err)=>{
				return res.status(200).send({
					status: 'error',
					message: 'La extención del archivo no es valida'
				})
			})
		}else{
			// sacar el id del usuario identificado
			var userId = req.user.sub;

			// buscar y actualizar documentos de la bd
			User.findOneAndUpdate({_id: userId}, {image: file_name}, {new: true}, (err, userUpdated)=>{
				if(err || !userUpdated){
					//devolver respuesta
					return res.status(500).send({
						status: 'error',
						message: 'error al subir la imagen del usuario!!!'
					})
				}
				//devolver respuesta
				return res.status(200).send({
					status: 'success',
					message: 'upload avatar!!!',
					user: userUpdated
				})
			})

		}

		
	},

	avatar: function(req, res){
		var fileName = req.params.fileName;
		var pathFile =  './uploads/users/' + fileName;

		fs.exists(pathFile, (exists)=>{
			if(exists){
				return res.sendFile(path.resolve(pathFile));
			}else{
				return res.status(404).send({
					message: 'laimagen no existe'
				})
			}
		})
	},

	getUsers : function(req, res){
		User.find().exec((err, users)=>{
			if(err || !users){
				return res.status(404).send({
					status: 'error',
					message: 'No hay usuarios que mostrar'
				});
			}

			return res.status(200).send({
				status: 'success',
				users
			})
		});
	},

	getUser : function(req, res){
		var userId = req.params.userId;
		User.findById(userId).exec((err, user)=>{
			if(err || !user){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el usuario'
				});
			}
			return res.status(200).send({
				status: 'success',
				user
			})
		})

	}


};

module.exports = controller;