'use strict';

const controllers = require('../controllers/index');
const control = require('../controllers/user');
const router = require('express').Router();




router.post('/login', (req, res, callback) => {
    controllers.execute(req, res, control.login);
});

router.post('/add', (req, res, callback) => {
    controllers.execute(req, res, control.add);
});

router.post('/get', (req, res, callback) => {
    controllers.execute(req, res, control.get);
});

router.put('/update', (req, res, callback) => {
    controllers.execute(req, res, control.update);
})

router.delete('/delete', (req, res, callback) => {
    controllers.execute(req,res,control.delete);
})


module.exports = router;