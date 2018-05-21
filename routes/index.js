const router = require('express').Router();
const client = require('./client');
const evento = require('./evento');

// TODO
// MAPBOX
router.use('/client', client);
router.use('/evento', evento);



module.exports = router;
