'use strict';

const control = require('../controllers/user');
const router = require('express').Router();
const { body } = require('express-validator/check');
const {
    execute,
    validateUserPSQL,
    validateNewUser,
    validateDateBirth } = require('../controllers');

const Regex = /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ\040]+$/i;


router.post('/login',
    validateUserPSQL('email'),
    execute(control.login));


router.post('/add',
    validateNewUser([
        body('info.name').isString().trim().isLength({ min: 3, max: 15 }).matches(Regex),
        body('info.email').isEmail().trim(),
        body('info.password').isString().trim().isLength({ min: 5, max: 15 }),
        //body('info.cellphone').isAlphanumeric('pt-BR').isLength({ min: 10, max: 10 }), @TODO
    ]),
    //validateDateBirth('info.date_birth'), @TODO check how front-end is gonna send the DATE
    execute(control.add));

// router.post('/get', (req, res, callback) => {
//     controllers.execute(req, res, control.get);
// });

// router.put('/update', (req, res, callback) => {
//     controllers.execute(req, res, control.update);
// });

// router.delete('/delete', (req, res, callback) => {
//     controllers.execute(req, res, control.delete);
// })


module.exports = router;