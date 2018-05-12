

const controllers = require('../controllers');
const controll = require('../controllers/client');
const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  controllers.execute(req, res, controll.add);
});

router.post('/', (req, res) => {
  controllers.execute(req, res, controll.get);
});


module.exports = router;
