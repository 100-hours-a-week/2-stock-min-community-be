const fs = require('fs');
const postsModel = require('../models/postsModel');
const path = require('path');

exports.getPostListPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../Public', 'Html', 'post', 'post_list.html')
  );
};
exports.getPostNewPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../Public', 'Html', 'post', 'post_add.html')
  );
};
exports.getPostDetail = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../Public', 'Html', 'post', 'post_detail.html')
  );
};
exports.getModifyPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../Public', 'Html', 'post', 'post_modify.html')
  );
};

exports.createPost = (req, res) => {
  const { title, content, postDate } = req.body;

  const postData = {
    postImage: req.file ? `/uploads/postImage/${req.file.filename}` : '',
    userID: 0,
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
  const query = `SELECT postImage from POSTS WHERE post_id = ${req.body.postID}`;
  postsModel.anyQuery(query, (err, results) => {
    if (err) return res.status(500).send('Error get query');

    const filePath = path.join(
      __dirname,
      '../middlewares',
      results[0].postImage
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('파일 삭제중 오류 발생 : ', err);
      } else {
        console.log('파일삭제 성공');
      }
    });
  });

  //게시글 수정
  const profilePath = req.file
    ? `/uploads/postImage/${req.file.filename}`
    : null;
  req.body.postIMG = profilePath;
  postsModel.updatePosts(req.body, (err, results) => {
    if (err) return res.status(500).send('Error Update Post');
    res.status(200).send({ message: 'Post Update Success' });
  });
};
exports.deletePost = (req, res) => {
  postsModel.deletePosts(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Delete Post');
    res.status(200).send({ message: 'Post Delete Success' });
  });
  postsModel.deletePostComment(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Delete All Post`s Comment');
  });
};
exports.getPosts = (req, res) => {
  postsModel.getPosts((err, results) => {
    if (err) return res.status(500).send('Error get Post Data');
    return res.status(200).send({ data: results });
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
  postsModel.getComment(req.params.postID, (err, results) => {
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
exports.countView = async (req, res) => {
  const postID = req.params.postID;
  const userID = req.session.user.email;

  try {
    const addView = await postsModel.addView(postID, userID);
    const getView = await postsModel.getViewCount(postID);
    res.status(200).json(getView);
  } catch (error) {
    res.status(500).send('조회수 송출중 에러');
  }
};
exports.addLike = async (req, res) => {
  const postID = req.params.postID;
  const userID = req.session.user.email;
  const addLike = await postsModel.addLike(postID, userID);
};
exports.countLike = async (req, res) => {
  const postID = req.params.postID;
  try {
    const getLike = await postsModel.getLikeCount(postID);
    res.status(200).json(getLike);
  } catch (error) {
    res.status(500).send('좋아요 송출중 에러');
  }
};
