'use strict';
const router = require('express').Router();
const { execute } = require('../controllers');
const user = require('./user');
const auth = require ('../auth/auth');

// Cria routes que não requerem autenticação
router.use('/', require('./unauthed'));

// Rotas Autenticadas
router.use(auth.authenticateToken);
router.use('/user', user);


// Metodo para retornar menssagem de erro padrão em JSON ao inves de HTML caso uma rota não registrada seja chamada
router.all('*',
    execute((req, res, callback) =>
        callback('Cannot ' + req.method + ' ' + req.url, 404)));

module.exports = router;
