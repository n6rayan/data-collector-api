const router = require('express').Router();

const controller = require('../controllers/providers');

router.post('/', (req, res) => controller.postProvider(req, res));

module.exports = router;