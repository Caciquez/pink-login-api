'use strict';
const router = require('express').Router();
const user = require('./user');
const OauthServer = require('express-oauth-server');

//const oauth = new OauthServer();

//router.post('/auth/acess', oauth.token());


// Cria routes que não requerem autenticação
router.use('/', require('./unauthed'));

// Rotas Autenticadas

router.use('/user', user);



module.exports = router;
