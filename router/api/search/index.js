const router = require('express').Router();
const controller = require('./search.controller');
const google = require('./GoogleSearch.controller');
const naver = require('./NaverSearch.controller');

router.post('/basicKeyword', controller.basicKeyword);
router.post('/Details', controller.Details);
router.post('/NaverKeyword', naver.NaverKeyword);
router.post('/NaverDetail', naver.NaverDetail);
router.post('/keyword', google.keyword);

module.exports = router;