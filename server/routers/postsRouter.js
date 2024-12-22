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

//내가 쓴 게시글, 댓글 목록 가져오기
router.get('/auth', postsController.getAuthList);

//LCV
router.get('/:postID/count/comment', postsController.countComment);

router.get('/:postID/check/like', postsController.checkLike);

router.get('/:postID/count/like', postsController.addLike);
router.delete('/:postID/count/like', postsController.deleteLike);
router.get('/:postID/count/view', postsController.addView);
router.get('/lcv/:postID', postsController.getPostLCV);

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
