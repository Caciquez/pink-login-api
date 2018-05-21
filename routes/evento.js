const controllers = require('../controllers');
const controll = require('../controllers/evento');
const router = require('express').Router();

router.post('/', (req, res, callback) => {
    controllers.execute(req, res, controll.add);
});

router.get('/', (req, res, callback) => {
    controllers.execute(req, res, controll.get);
});

router.post('/listOne', (req, res, callback) => {
    controllers.execute(req, res, controll.getOne);
});

router.delete('/del', (req, res, callback) => {
    controllers.execute(req, res, controll.del);
})


module.exports = router;
