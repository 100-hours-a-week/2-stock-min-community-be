const fs = require('fs');
const path = require('path');
const connection = require('../db');

// 파일 경로 설정
const filePath = path.join(__dirname, '../data/posts.json');

function getPostImage(postID, callback) {
  const query = `SELECT postImage from POSTS WHERE post_id = ${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function getPostLCV(postID, callback) {
  const query = `SELECT p.post_id,COUNT(DISTINCT l.user_id) AS like_count,COUNT(DISTINCT c.comment_id) AS comment_count,COUNT(DISTINCT v.user_id) AS view_count FROM POSTS p LEFT JOIN likeaccount l ON p.post_id = l.post_id LEFT JOIN COMMENT c ON p.post_id = c.post_id LEFT JOIN viewaccount v ON p.post_id = v.post_id WHERE p.post_id = 27 GROUP BY p.post_id;`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function getPosts(callback) {
  const query = `SELECT p.post_id,p.title,COUNT(DISTINCT l.user_id) AS like_count,COUNT(DISTINCT c.comment_id) AS comment_count,COUNT(DISTINCT v.user_id) AS view_count,p.postDate,p.autorProfile,p.autor FROM POSTS p LEFT JOIN likeaccount l ON p.post_id = l.post_id LEFT JOIN COMMENT c ON p.post_id = c.post_id LEFT JOIN viewaccount v ON p.post_id = v.post_id GROUP BY p.post_id;`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

function getAuthPosts(userID, callback) {
  const query = `SELECT post_id FROM POSTS WHERE user_id = ${userID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);

    callback(null, results);
  });
}

function addPosts(post, callback) {
  const query = `INSERT INTO POSTS (user_id,postImage, title, content, \`like\`, comment, view, postDate, autor,autorProfile) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  connection.query(
    query,
    [
      post.userID,
      post.postImage,
      post.title,
      post.content,
      post.like,
      post.comment,
      post.view,
      post.postDate,
      post.autor,
      post.autorProfile,
    ],
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    }
  );
}

function updatePosts(data, callback) {
  const query = `UPDATE POSTS SET title = '${data.title}',content ='${data.content}',postImage='${data.postIMG}' WHERE post_id = ${data.postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function deletePosts(postID, callback) {
  const query = 'DELETE FROM POSTS WHERE post_id=?';
  connection.query(query, postID, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

function addComment(postID, data, callback) {
  const query = `INSERT INTO COMMENT (post_id,user_id,profile,content,date,autor) VALUES (?,?,?,?,?,?)`;
  connection.query(
    query,
    [
      postID,
      data.userID,
      data.commentProfile,
      data.comment,
      data.commentDate,
      data.commentAutor,
    ],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    }
  );
}
function getAuthComments(userID, callback) {
  const query = `SELECT comment_id FROM COMMENT WHERE user_id = ${userID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function getPostComment(postID, callback) {
  const query = `SELECT comment_id,profile,content,date,autor FROM COMMENT WHERE post_id = ${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function deleteComment(commentID, callback) {
  const query = `DELETE FROM COMMENT AS c WHERE c.comment_id = ${commentID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function patchComment(commentID, data, callback) {
  const query = `UPDATE COMMENT SET content = '${data}' WHERE comment_id = ${commentID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

function deletePostComment(postID, callback) {
  const query = `DELETE FROM COMMENT WHERE post_id=${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

//LCV
function countComment(postID, callback) {
  const query = `SELECT COUNT(content) AS cnt FROM COMMENT WHERE post_id = ${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function addView(userID, postID, callback) {
  const query = `INSERT IGNORE INTO viewaccount (user_id,post_id) VALUES (?,?)`;
  connection.query(query, [userID, postID], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function countView(postID, callback) {
  const query = `SELECT COUNT(user_id) AS cnt FROM viewaccount WHERE post_id = ${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function addLike(userID, postID, callback) {
  const query = `INSERT IGNORE INTO likeaccount (user_id,post_id) VALUES (?,?)`;
  connection.query(query, [userID, postID], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function countLike(postID, callback) {
  const query = `SELECT COUNT(user_id) AS cnt FROM likeaccount WHERE post_id = ${postID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function checkLike(postID, userID, callback) {
  const query = `SELECT COUNT(user_id) AS cnt FROM likeaccount WHERE post_id = ${postID} AND user_id = ${userID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}
function deleteLike(postID, userID, callback) {
  const query = `DELETE FROM likeaccount WHERE post_id = ${postID} AND user_id = ${userID}`;
  connection.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

module.exports = {
  getPosts,
  addPosts,
  deletePosts,
  addComment,
  updatePosts,
  getPostComment,
  deleteComment,
  patchComment,
  getPostImage,
  deletePostComment,
  countComment,
  addView,
  countView,
  addLike,
  countLike,
  checkLike,
  deleteLike,
  getAuthComments,
  getAuthPosts,
  getPostLCV,
};
