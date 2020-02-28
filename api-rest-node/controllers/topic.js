'use strict'

var validator = require('validator');
var Topic = require('../models/topic');


var controller = {
	test: function(req, res){
		return res.status(200).send({
			message: 'controlador de topic'
		});
	},

	save: function(req, res){
		// obtener parametrso por post
		var params = req.body;
		console.log(params);

		// validar datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_lang = !validator.isEmpty(params.lang);
		}catch(err){
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}

		if(validate_content && validate_title && validate_lang){
			// crear objeto a guardar
			var topic = new Topic();

			// asignar valores
			topic.title = params.title;
			topic.content = params.content;
			topic.code = params.code;
			topic.lang = params.lang;
			topic.user = req.user.sub;

			// guardar topic
			topic.save((err, topicStored)=>{
				if(err || !topicStored){
					return res.status(404).send({
						status: 'error',
						message: 'El tema no se ha guardado'
					});
				}
				return res.status(200).send({
					status: 'success',
					topic: topicStored
				});
			});

		}else{
			return res.status(200).send({
				message: 'los datos no son validos'
			});
		}
	},

	getTopics: function(req, res){
		// cargar la libreria de paginación en la clase (MODELO)

		// Obtener la pagina actual
		if(!req.params.page || req.params.page == 0 || req.params.page == '0' || req.params.page == null || req.params.page == undefined){
			var page = 1;
		}else{
			var page = parseInt(req.params.page);
		}

		// indicar las opciones de paginación 
		var options = { 
			sort: { date: -1 },
			populate: 'user',
			limit: 5,
			page: page
		}; 

		// find paginado
		Topic.paginate({}, options, (err, topics)=>{
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});
			}

			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No hay topics'
				});
			}

			// devolver resultado (topics, total topic, total de paginas)

			// respuesta
			return res.status(200).send({
				status: 'success',
				topics: topics.docs,
				totalDocs: topics.totalDocs,
				totalPages: topics.totalPages
			});
		});

		
	},

	getTopicsByUser: function(req, res){
		// conseguir el id del usuario
		var userId = req.params.user;

		// find con una condicion de usuario
		Topic.find({
			user: userId
		})
		.sort([['date', 'descending']])
		.exec((err, topics)=>{
			if(err){
				// devolver resultado
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición'
				});
			}
			if(!topics){
				// devolver resultado
				return res.status(404).send({
					status: 'error',
					message: 'No hay topics para mostrar'
				});
			}
			// devolver resultado
			return res.status(200).send({
				status: 'success',
				topics
			});
		});

	},

	getTopic: function(req, res){
		// sacar el id del topic de la url
		var topicId = req.params.id;


		// find por di del topic
		Topic.findById(topicId)
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
	},

	update: function(req, res){
		// Obtener el id del topic de la url
		var topicId = req.params.id;

		// obtener los datos que llegan de post
		var params = req.body;

		// validar datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_lang = !validator.isEmpty(params.lang);

		}catch(err){
			return res.status(200).send({
				message: 'faltan datos por enviar update topic'
			});
		}
		if(validate_title && validate_content && validate_lang){
			// montar un json con los datos modificados
			var update = {
				title: params.title,
				content: params.content,
				code: params.code,
				lang: params.lang
			}

			// find and update del topic por di y por di de usuario
			Topic.findOneAndUpdate({ _id: topicId, user: req.user.sub }, update, {new: true}, (err, topicUpdated)=>{
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error en la petición'
					});	
				}
				if(!topicUpdated){
					return res.status(404).send({
						status: 'error',
						message: 'No se ha actualizado el tema'
					});		
				}
				return res.status(200).send({
					status: 'success',
					topic: topicUpdated
				});
			});
		}else{
			return res.status(200).send({
				message: 'La validación de los datos no es correcta !!!'
			})
		}
		
	},

	delete: function(req, res){
		// sacar id del topic de la url
		var topicId = req.params.id;

		// find and delete por topicID y por userID
		Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicDeleted)=>{
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'No se puede borrar el topic'
				});
			}
			if(!topicDeleted){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el topic'
				});
			}
			// DEvolver respuesta
			return res.status(200).send({
				status: 'success',
				topic: topicDeleted
			});
		});
		
	},

	search: function(req, res){
		// obtener el string a buscar de la url
		var searchString = req.params.search;

		// find con operador OR
		Topic.find({ "$or": [
				{ "title": { "$regex": searchString, "$options": "i"} }, 
				{ "content": { "$regex": searchString, "$options": "i"} }, 
				{ "lang": { "$regex": searchString, "$options": "i"} },
				{ "code": { "$regex": searchString, "$options": "i"} }
			]
		})
		.populate('user')
		.sort([['date','descending']])
		.exec((err, topics)=>{
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'error en la petición'
				});
			}
			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No hay temas disponibles'
				});
			}
			// Devolver resultado

			return res.status(200).send({
				status: 'success',
				topics
			});
		});

		
	}
}

module.exports = controller;