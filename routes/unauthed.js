'use strict';

const router = require('express').Router();
const { param } = require('express-validator/check');
const userController = require('../controllers/user');
const { execute } = require('../controllers/index');

//Rota não authenticada para confirmar criação de conta.
router.get('/confirm/:hex/',
    param('hex').isUUID(),
    execute(userController.confirm));



module.exports = router;
