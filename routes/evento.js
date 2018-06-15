'use strict';
const controllers = require('../controllers');
const controll = require('../controllers/evento');
const router = require('express').Router();

//Add a new event
router.post('/add', (req, res, callback) => {
    controllers.execute(req, res, controll.add);
});
//Get all events to feed the page time-line
router.get('/ListAll', (req, res, callback) => {
    controllers.execute(req, res, controll.get);
});

//Get a specific Event
router.post('/listOne', (req, res, callback) => {
    controllers.execute(req, res, controll.getOne);
});

//Delete a event
router.delete('/del', (req, res, callback) => {
    controllers.execute(req, res, controll.del);
})


module.exports = router;
