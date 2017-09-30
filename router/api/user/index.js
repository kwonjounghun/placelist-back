const router = require('express').Router();
const controller = require('./user.controller');
const authMiddleware = require('../../../middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);

//authMiddleware는 토큰이 유효한지 검증을 하고 다음 기능을 실행시켜주는 검증 middleware이다.
//검증이 필요한 모든 api앞에 authMiddleware는를 넣어주면 된다.
router.use('/check', authMiddleware);
router.get('/check', controller.check);
module.exports = router;