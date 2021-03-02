const router = require('express').Router();

const controller = require('../controllers/providers');

router.get('/:id', (req, res) => controller.getProvider(req, res));

module.exports = router;