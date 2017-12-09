const router = require('express').Router();
const search = require('./search');
const user = require('./user');
const list = require('./list');
const authMiddleware = require('../../middlewares/auth');

//authMiddleware는 토큰이 유효한지 검증을 하고 다음 기능을 실행시켜주는 검증 middleware이다.
//검증이 필요한 모든 api앞에 authMiddleware는를 넣어주면 된다.
router.use('/search', authMiddleware);
router.use('/search', search);
router.use('/place', authMiddleware);
router.use('/place', list);
router.use('/user', user);

module.exports = router;