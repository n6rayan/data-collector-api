const router = require('express').Router();

router.use('/providers', require('./providers'));

module.exports = router;