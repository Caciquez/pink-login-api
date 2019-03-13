'use strict';
const router = require('express').Router();
const user = require('./user');
const oAuthServer = require('express-oauth-server');

const oauth = new oAuthServer({ model: require('../model/oauth2') });

router.post('/auth/acess_token', oauth.token());

// Cria routes que não requerem autenticação
router.use('/', require('./unauthed'));

// Rotas Autenticadas
//router.use(oauth.authenticate());
router.use('/user', user);


module.exports = router;
