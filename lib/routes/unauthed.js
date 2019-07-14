'use strict';

const router = require('express').Router();
const { param } = require('express-validator/check');
const userControl = require('../controllers/user');
const { execute, validateUserPSQL } = require('../controllers/index');


//Route unathenticated to confirm account creation
router.get('/confirm/:hex/',
    param('hex').isUUID(),
    execute(userControl.confirm));

//Route unathenticated to user execute login action
router.post('/login',
    validateUserPSQL('email'), //@ToDo Insert middlewares to validate device_token and APP_ID
    execute(userControl.login));

module.exports = router;
