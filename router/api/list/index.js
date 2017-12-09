const router = require('express').Router();
const controller = require('./list.controller');
const authMiddleware = require('../../../middlewares/auth');

router.post('/addList', controller.addList);
router.post('/removeList', controller.removeList);
router.get('/getList/:sigugun/:category', controller.getList);
router.get('/getFillterList', controller.getFillterList);

module.exports = router;