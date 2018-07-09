const router = require('express').Router();
const client = require('./client');
const evento = require('./evento');
const user = require('./user');

// TODO
// MAPBOX
router.use('/client', client);
router.use('/evento', evento);
router.use('/user' ,user);


module.exports = router;
