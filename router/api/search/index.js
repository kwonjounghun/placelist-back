const router = require('express').Router();
const controller = require('./search.controller');

router.post('/place', controller.search);

module.exports = router;