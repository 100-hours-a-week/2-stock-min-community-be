import fs from 'fs';
import postsModel from '../models/postsModel.js';
import moment from 'moment';
import path from 'path';

function createPost(req, res) {
  const { title, content, postDate } = req.body;

  const postData = {
    postImage: req.file ? `/uploads/postImage/${req.file.filename}` : '',
    userID: req.session.user.id,
    title,
    content,
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
}
function updatePost(req, res) {
  //전에 있던 이미지 파일 삭제
  postsModel.getPostImage(req.body.postID, (err, results) => {
    if (err) return res.status(500).send('Error get postImage');
    if (results[0].postImage) {
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
}

function deletePost(req, res) {
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
}
function getPosts(req, res) {
  postsModel.getPosts((err, results) => {
    if (err) return res.status(500).send('Error get Post Data');
    return res.status(200).send({ data: results });
  });
}
function getPostContent(req, res) {
  postsModel.getPostContent(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Get Post Content');
    return res.status(201).send(results);
  });
}

//내가 쓴 게시글, 댓글 목록
function getAuthList(req, res) {
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
}

// COMMENT
function createComment(req, res) {
  req.body.userID = req.session.user.id;
  req.body.commentAutor = req.session.user.nickname;
  req.body.commentProfile = req.session.user.profile;
  postsModel.addComment(req.params.postID, req.body, (err, results) => {
    if (err) return res.status(500).send('Error Add Comment');
    return res.status(200).send({ message: 'Add Comment Success' });
  });
}
function getComment(req, res) {
  postsModel.getPostComment(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Get Comment');
    return res
      .status(200)
      .send({ message: 'Get Comment Success', data: results });
  });
}
function deleteComment(req, res) {
  postsModel.deleteComment(req.params.commentID, (err, results) => {
    if (err) return res.status(500).send('Error Delete Comment');
    return res.status(200).send({ message: 'Delete Success' });
  });
}
function patchComment(req, res) {
  postsModel.patchComment(
    req.params.commentID,
    req.body.data,
    (err, results) => {
      if (err) return res.status(500).send('Error Patch Comment');
      return res.status(200).send({ message: 'patch Comment Success' });
    }
  );
}

//LCV Count
function countComment(req, res) {
  postsModel.countComment(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('Error Count Comment');
    return res.status(200).send({ message: 'countSuccess', data: results });
  });
}

function getPostLCV(req, res) {
  postsModel.getPostLCV(req.params.postID, (err, results) => {
    if (err) return res.status(500).send('get LCV error');
    return res.status(201).send(results);
  });
}

function addView(req, res) {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.addView(userID, postID, (err, results) => {
    if (err) return res.status(500).send('add view error');
    return res.status(201).send('add view success');
  });
}

function addLike(req, res) {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.addLike(userID, postID, (err, results) => {
    if (err) return res.status(500).send('add view error');
    return res.status(201).send('add like');
  });
}

function checkLike(req, res) {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.checkLike(postID, userID, (err, results) => {
    if (err) return res.status(500).send('error check like');
    return res.status(201).send({ data: results });
  });
}
function deleteLike(req, res) {
  const userID = req.session.user.id;
  const postID = req.params.postID;
  postsModel.deleteLike(postID, userID, (err, results) => {
    if (err) return res.status(500).send('error delete like');
    return res.status(201).send('delete like');
  });
}

export default {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostContent,
  getAuthList,
  createComment,
  getComment,
  deleteComment,
  patchComment,
  countComment,
  getPostLCV,
  addView,
  addLike,
  checkLike,
  deleteLike,
};
