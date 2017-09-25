const router = require('express').Router();
const controller = require('./search.controller');

router.post('/basicKeyword', controller.basicKeyword);
router.post('/keyword', controller.keyword);
router.post('/keyword/GoogleDetails', controller.GoogleDetails);
router.post('/autoKeyword', controller.autoKeyword); // 다음버전에...

module.exports = router;