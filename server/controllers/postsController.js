const fs = require('fs');
const postsModel = require('../models/postsModel');
const moment = require('moment');
const path = require('path');

exports.createPost = (req, res) => {
  const { title, content, postDate } = req.body;

  const postData = {
    postImage: req.file ? `/uploads/postImage/${req.file.filename}` : '',
    userID: req.session.user.id,
    title,
    content,
    like: 0,
    comment: 0,
    view: 0,
    postDate,
    autor: req.session.user.nickname,
    autorProfile: req.session.user.profile,
  };

  postsModel.addPosts(postData, (err, results) => {
    if (err) {
      console.error('MySQL Error: ', err);
      return res.status(500).send('Error Create Post');
    }
    res.status(200).send({ message: 'Post Add Success' });
  });
};
exports.updatePost = (req, res) => {
  //전에 있던 이미지 파일 삭제
  postsModel.getPostImage(req.body.postID, (err, results) => {
    if (err) return res.status(500).send('Error get postImage');
    if (results.postImage) {
      const filePath = path.join(__dirname, `..${results[0].postImage}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('파일 삭제중 오류 발생 : ', err);
        } else {
          console.log('파일삭제 성공');
        }
      });
    }
  });

  //게시글 수정
  const profilePath = req.file ? `/uploads/postImage/${req.file.filename}` : '';
  req.body.postIMG = profilePath;
  postsModel.updatePosts(req.body, (err, results) => {
    if (err) return res.status(500).send('Error Update Post');
    res.status(200).send({ message: 'Post Update Success' });
  });
};

exports.deletePost = (req, res) => {
  postsModel.getPostImage(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('get Post Image');

    if (results.postImage) {
      const filePath = path.join(__dirname, `..${results[0].postImage}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('파일 삭제중 오류 발생 : ', err);
        } else {
          console.log('파일삭제 성공');
        }
      });
    }
  });
  postsModel.deletePosts(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Delete Post');

    res.status(200).send({ message: 'Post Delete Success' });
  });
};
exports.getPosts = (req, res) => {
  postsModel.getPosts((err, results) => {
    if (err) return res.status(500).send('Error get Post Data');

    return res.status(200).send({ data: results });
  });
};

//내가 쓴 게시글, 댓글 목록
exports.getAuthList = (req, res) => {
  const userID = req.session.user.id;
  const authList = {
    post: '',
    comment: '',
  };
  postsModel.getAuthPosts(userID, (err, results) => {
    if (err) return res.status(501).status('게시글 권한 목록 받아오기 에러');
    authList.post = results;
  });
  postsModel.getAuthComments(userID, (err, results) => {
    if (err) return res.status(501).status('댓글 권한 목록 받아오기 에러');
    authList.comment = results;

    return res.status(201).send(authList);
  });
};

// COMMENT
exports.createComment = (req, res) => {
  req.body.userID = req.session.user.id;
  req.body.commentAutor = req.session.user.nickname;
  req.body.commentProfile = req.session.user.profile;
  postsModel.addComment(req.params.postID, req.body, (err, results) => {
    if (err) return res.status(500).send('Error Add Comment');
    return res.status(200).send({ message: 'Add Comment Success' });
  });
};
exports.getComment = (req, res) => {
  postsModel.getPostComment(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Get Comment');
    return res
      .status(200)
      .send({ message: 'Get Comment Success', data: results });
  });
};
exports.deleteComment = (req, res) => {
  postsModel.deleteComment(req.params.commentID, (err, results) => {
    if (err) return res.status(500).send('Error Delete Comment');
    return res.status(200).send({ message: 'Delete Success' });
  });
};
exports.patchComment = (req, res) => {
  postsModel.patchComment(
    req.params.commentID,
    req.body.data,
    (err, results) => {
      if (err) return res.status(500).send('Error Patch Comment');
      return res.status(200).send({ message: 'patch Comment Success' });
    }
  );
};

//Count
exports.countComment = (req, res) => {
  postsModel.countComment(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Count Comment');
    return res.status(200).send({ message: 'countSuccess', data: results });
  });
};

exports.countView = (req, res) => {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.addView(userID, postID, (err, results) => {
    if (err) return res.status(500).send('add view error');
  });
  // postsModel.countView(postID, (err, results) => {
  //   if (err) return res.status(500).send('count view error');
  //   return res.status(201).send({ data: results });
  // });
};

exports.addLike = (req, res) => {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.addLike(userID, postID, (err, results) => {
    if (err) return res.status(500).send('add view error');
  });
  // postsModel.countLike(postID, (err, results) => {
  //   if (err) return res.status(500).send('count view error');
  //   return res.status(201).send({ data: results });
  // });
};

// exports.countLike = (req, res) => {
//   const postID = req.params.postID;
//   postsModel.countLike(postID, (err, results) => {
//     if (err) return res.status(500).send('count view error');
//     return res.status(201).send({ data: results });
//   });
// };
exports.checkLike = (req, res) => {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.checkLike(postID, userID, (err, results) => {
    if (err) return res.status(500).send('error check like');
    return res.status(201).send({ data: results });
  });
};
exports.deleteLike = (req, res) => {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.deleteLike(postID, userID, (err, results) => {
    if (err) return res.status(500).send('error delete like');
  });

  // postsModel.countLike(postID, (err, results) => {
  //   if (err) return res.status(500).send('count view error');
  //   return res.status(201).send({ data: results });
  // });
};
