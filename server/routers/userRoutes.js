const express = require('express');
const upload = require('../multer');
const router = express.Router();
const userController = require('../controllers/userController');

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login first');
  }
  next(); // 인증 통과 시 다음 로직으로 진행
}
// USER
router.get('/regist', userController.getRegistPage);

router.post(
  '/regist',
  upload('profile').single('profile'),
  userController.createUser
);

router.get('/login', userController.getLoginPage);
router.post('/login', userController.login);
router.get('/logout', isAuthenticated, userController.logout);

router.get('/users', userController.fetchUsers);
router.get(
  '/user/nickname',
  isAuthenticated,
  userController.getModifyNicknamePage
);
router.get(
  '/user/password',
  isAuthenticated,
  userController.getModifyPasswordPage
);

router.get('/user', isAuthenticated, userController.getCurrentUser);
router.patch('/user', isAuthenticated, userController.patchUser);
router.delete('/user', isAuthenticated, userController.deleteUser);

router.post('/check-duplicated', userController.checkDuplicated);

module.exports = router;
