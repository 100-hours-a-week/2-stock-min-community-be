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

router.post(
  '/regist',
  upload('profile').single('profile'),
  userController.createUser
);

router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/users', userController.fetchUsers);

router.get('/user', userController.getCurrentUser);
router.patch('/user', userController.patchUser);
router.delete('/user', userController.deleteUser);

router.post('/check-duplicated', userController.checkDuplicated);

module.exports = router;
