var express = require('express'),
    router = express.Router();

router.use('/j', require('./aws'));

module.exports = router
