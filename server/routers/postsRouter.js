const express = require('express');
const upload = require('../multer');
const router = express.Router();
const postsController = require('../controllers/postsController');

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login first');
  }
  next(); // 인증 통과 시 다음 로직으로 진행
}

router.get('/', postsController.getPosts);

router.post(
  '/',

  upload('postImage').single('postImage'),
  postsController.createPost
);

router.patch(
  '/:postID',

  upload('postImage').single('postIMG'),
  postsController.updatePost
);
router.delete('/:postID', postsController.deletePost);

// router.get('/new',  postsController.getPostNewPage);
// router.get('/:postID',  postsController.getPostDetail);

//LCV
router.get(
  '/:postID/count/comment',

  postsController.countComment
);
router.get('/:postID/count/view', postsController.countView);
router.get('/:postID/count/like', postsController.countLike);
router.get('/:postID/check/like', postsController.checkLike);
router.post('/:postID/count/like', postsController.addLike);
router.delete(
  '/:postID/count/like',

  postsController.deleteLike
);

// COMMENT
router.get('/comment/:postID', postsController.getComment);
router.post('/comment/:postID', postsController.createComment);
router.patch(
  '/comment/:commentID',

  postsController.patchComment
);
router.delete(
  '/comment/:commentID',

  postsController.deleteComment
);

module.exports = router;
