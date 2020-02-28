'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

// libreria que permite recibir elementos tipo ficheros
var multipart = require('connect-multiparty');
// se crea el directorio donde se van a guardar los ficheros, en la raiz del proyecto
var md_upload = multipart({ uploadDir: './uploads/users'});

/* 
	rutas de prueba 
	params
		nombre de la ruta
		nombre del método existente en el controlador
*/
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// rutas de usuarios
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated, md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar );
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports = router;