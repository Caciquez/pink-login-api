'use strict';
const controllers = require('../controllers');
const controll = require('../controllers/client');
const express = require('express');

const router = express.Router();

//Create a new Client
router.post('/add', (req, res) => {
  controllers.execute(req, res, controll.add);
});

//Get all Clients for the Home timeline
router.get('/', (req, res) => {
  controllers.execute(req, res, controll.get);
});

//Get a specific Client to acess his page.
router.post('/listOne', (req, res) => {
  controllers.execute(req, res, controll.getOne);
});

module.exports = router;
