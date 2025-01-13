import fs from 'fs';
import path from 'path';

import userModel from '../models/userModel.js';

function getCurrentUser(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: No user logged in' });
  }

  res.status(200).json({
    id: req.session.user.id,
    email: req.session.user.email,
    nickname: req.session.user.nickname,
    profile: req.session.user.profile,
  });
}

function createUser(req, res) {
  const userData = req.body;

  const profilePath = req.file ? `/uploads/profile/${req.file.filename}` : null;

  userData.profile = profilePath;

  userModel.addUser(userData, (error, results) => {
    if (error) {
      res.status(500).send('사용자 추가 실패');
      return;
    }
    res.status(201).json({ message: '사용자 추가 성공', id: results.email });
  });
}
function deleteUser(req, res) {
  const id = req.session.user.id;
  const filePathProfile = path.join(__dirname, `..${req.session.user.profile}`);

  //작성자가 지금까지 작성했던 게시글의 이미지 전부 삭제
  userModel.deleteUserPostImage(id, (err, results) => {
    if (err) return res.status(500).send('get PostImage error');

    if (results[0]) {
      if (results[0].postImage)
        results.map((element) => {
          const filePathPostImage = path.join(
            __dirname,
            `..${element.postImage}`
          );
          fs.unlink(filePathPostImage, (err) => {
            if (err) {
              console.error('파일 삭제 중 오류 발생', err);
            } else {
              console.log('파일 삭제 성공');
            }
          });
        });
    }
  });
  userModel.deleteUser(id, (error, results) => {
    if (error) {
      return res.status(500).send('회원탈퇴 실패');
    }
    fs.unlink(filePathProfile, (err) => {
      if (err) {
        console.error('파일 삭제 중 오류 발생', err);
      } else {
        console.log('파일 삭제 성공');
      }
    });
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 실패:', err);
        return res.status(500).send('Error deleting session');
      }
      console.log('success delete');
      res.clearCookie('connect.sid'); // 세션 쿠키 삭제
      res.status(200).send('User successfully deleted');
    });
  });
}
function patchUser(req, res) {
  const { data, field } = req.body;
  const profile = req.file
    ? `/uploads/profile/${req.file.filename}`
    : req.session.user.profile;

  const id = req.session.user.id;

  const patchData = {
    data,
    field,
    profile,
    id,
  };

  userModel.patchUser(patchData, (err, results) => {
    if (err) {
      return res.status(500).send('Error Patch User');
    }
    if (field === 'nickname') {
      const filePathProfile = path.join(
        __dirname,
        `..${req.session.user.profile}`
      );
      req.session.user.nickname = data;
      if (patchData.profile !== req.session.user.profile) {
        console.log(patchData.profile);
        console.log(req.session.user.profile);
        fs.unlink(filePathProfile, (err) => {
          if (err) {
            console.error('파일 삭제 중 오류 발생', err);
          } else {
            console.log('파일 삭제 성공');
          }
        });
      }
      req.session.user.profile = patchData.profile;
    }
    res.status(200).send({ message: 'User Patch Success' });
  });
}

function login(req, res) {
  const { email, password } = req.body;
  userModel.getUsers((err, results) => {
    if (err) {
      res.status(500).send('사용자 데이터를 가져오는데 실패했습니다.');
      return;
    }
    const user = results.find(
      (element) => element.email === email && element.password === password
    );
    //로그인 정보가 일치하면 세션에 해당 정보 저장
    if (user) {
      req.session.user = {
        id: user.user_id,
        email: user.email,
        nickname: user.nickname,
        profile: user.profile,
      };
    } else {
      return;
    }

    res.cookie('loggedIn', true, { httpOnly: true });
    return res.status(200).send('Login successful');
  });
}
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      return res.status(500).send('Error deleting session');
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    res.status(200).send('User successfully deleted');
  });
}
function fetchUsers(req, res) {
  userModel.getUsers((err, results) => {
    if (err) {
      res.status(500).send('can not access user info');
      return;
    }
    res.status(200).json(results);
  });
}

function checkDuplicated(req, res) {
  const { data, field } = req.body;

  userModel.isDuplicated(field, (error, results) => {
    if (error) {
      res.status(500).send('error check duplicated');
      return false;
    }
    if (results.some((element) => element[`${field}`] === data)) {
      return res.json({ duplicated: true });
    } else {
      return res.json({ duplicated: false });
    }
  });
}

export default {
  checkDuplicated,
  fetchUsers,
  getCurrentUser,
  createUser,
  deleteUser,
  patchUser,
  login,
  logout,
};
