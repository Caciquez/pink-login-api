

const controllers = require('../controllers');
const controll = require('../controllers/client');
const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  controllers.execute(req, res, controll.add);
});

router.get('/', (req, res) => {
  controllers.execute(req, res, controll.get);
});

router.post('/listOne', (req, res) => {
  controllers.execute(req, res, controll.getOne);
});

module.exports = router;
