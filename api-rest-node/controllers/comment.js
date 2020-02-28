'use strict'

var validator = require('validator');
// var Comment = require('../models/comment');
var Topic = require('../models/topic');

var controller = {
	metodo: function(req, res){
		return res.status(200).send({
			message: 'metodo base'
		});
	},
	add: function(req, res){
		// obtener id topic url
		var topicId = req.params.topicId;
		// find por id del topic
		Topic.findById(topicId).exec((err, topic)=>{
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				})
			}
			if(!topic){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el tema'
				})
			}
			// comprobar objeto usuario y validar datos
			if(req.body.content){
				// validar datos
				try{
					var validate_content = !validator.isEmpty(req.body.content);

				}catch(err){
					return res.status(200).send({
						message: 'No has comentado nada'
					})
				}

				if(validate_content){
					var comment = {
						user: req.user.sub,
						content: req.body.content
					}
					// en la propiedad comments del objeto hacer un push
					topic.comments.push(comment);
					// guardar topic completo
					topic.save((err)=>{
						if(err){
							return res.status(500).send({
								status: 'error',
								message: 'Error al guardar el comentario'
							});
						}

						Topic.findById(topic._id)
						.populate('user')
						.populate('comments.user')
						.exec((err, topic)=>{
							if(err){
								return res.status(500).send({
									status: 'error',
									message: 'Error en la petición del topic'
								});
							}
							if(!topic){
								return res.status(404).send({
									status: 'error',
									message: 'No existe el topic'
								});
							}
							return res.status(200).send({
								status: 'success',
								topic
							});
						});

						// return res.status(200).send({
						// 	status: 'success',
						// 	topic
						// });
					});

				}else{
					return res.status(200).send({
						message: 'No se han validado los datos del contenido'
					})
				}
			}

		});
		
	},
	update: function(req, res){
		// conseguir id del comentario de la url
		var commentId = req.params.commentId;

		// obtener datos y validar
		var params = req.body;

		// validar datos

		try{
			var validate_content = !validator.isEmpty(params.content);
		}catch(err){
			return res.status(200).send({
				message: 'Error en la validacion de comentarios update'
			});
		}

		if(validate_content){
			// hacer find and update de sub document de un comentario
			// operadores de actulaizacion permite dar valores a un campo de un subdocumento
			Topic.findOneAndUpdate(
				{ "comments._id": commentId },
				{
					"$set": { // operador de actualización
						"comments.$.content": params.content
					}
				},
				{ new: true},
				(err, topicUpdated)=>{
					if(err){
						return res.status(500).send({
							status: 'error',
							message: 'error en metodo update comment'
						});
					}
					if(!topicUpdated){
						return res.status(404).send({
							status: 'error',
							message: 'no existe el comentario en el topic'
						});
					}
					// devolver datos

					return res.status(200).send({
						status: 'success',
						topic: topicUpdated
					});
				}
			);

		}else{
			return res.status(200).send({
				message: 'error metodo update comment en la validación'
			});
		}
	},
	delete: function(req, res){
		// sacar id del topic y comentario a borrar que llega por url
		var topicId = req.params.topicId;
		var commentId = req.params.commentId;

		// buscar el topic 
		Topic.findById( topicId, (err, topic)=>{
			if(err){
				return res.status(200).send({
					status: 'error',
					message: 'Error al borrar el comentario'
				})
			}
			if(!topic){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el topic'
				});
			}
			// seleccionar el subdocumento (comment)
			var comment = topic.comments.id(commentId);

			// borrar comentario
			if(comment){
				comment.remove();
				// guardar topic
				topic.save((err)=>{
					if(err){
						return res.status(500).send({
							status: 'error',
							message: 'Error en la petición'
						});
					}

					// DEvolver respuesta
					Topic.findById(topic._id)
						.populate('user')
						.populate('comments.user')
						.exec((err, topic)=>{
							if(err){
								return res.status(500).send({
									status: 'error',
									message: 'Error en la petición del topic'
								});
							}
							if(!topic){
								return res.status(404).send({
									status: 'error',
									message: 'No existe el topic'
								});
							}
							return res.status(200).send({
								status: 'success',
								topic
							});
						});
				});

				
			}else{
				return res.status(404).send({
					status: 'error',
					message: 'No existe el comment a borrar'
				});
			}
		});
	}



}

module.exports = controller;