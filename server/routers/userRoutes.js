import express from 'express';
import { upload } from '../multer.js';
import userController from '../controllers/userController.js';
const router = express.Router();

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
router.patch(
  '/user',
  upload('profile').single('profile'),
  userController.patchUser
);
router.delete('/user', userController.deleteUser);

router.post('/check-duplicated', userController.checkDuplicated);

export default router;
