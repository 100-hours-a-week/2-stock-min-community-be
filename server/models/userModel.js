const connection = require('../db');

// 사용자 데이터 가져오기
function getUsers(callback) {
  connection.query('SELECT * FROM USER', (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

//중복값확인
function isDuplicated(field, callback) {
  const query = `SELECT ${field} FROM USER`;
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

// 사용자 데이터 추가하기
function addUser(user, callback) {
  const query =
    'INSERT INTO USER (email,profile,password,nickname) VALUES (?,?,?,?)';
  connection.query(
    query,
    [user.email, user.profile, user.password, user.nickname],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    }
  );
}
function deleteUser(id, callback) {
  const query = 'DELETE FROM USER WHERE user_id=?';
  connection.query(query, id, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}
function patchUser(patchData, callback) {
  const query = `UPDATE USER SET ${patchData.field} = '${patchData.data}' WHERE user_id = ${patchData.id}`;
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

function deleteUserPostImage(userID, callback) {
  const query = `SELECT postImage FROM POSTS WHERE user_id = ${userID}`;
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

module.exports = {
  getUsers,
  addUser,
  isDuplicated,
  deleteUser,
  patchUser,
  deleteUserPostImage,
};
