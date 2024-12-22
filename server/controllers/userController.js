const fs = require('fs');
const path = require('path');

const userModel = require('../models/userModel');

// exports.getModifyNicknamePage = (req, res) => {
//   res.sendFile(
//     path.join(__dirname, '../../../fe/Public/Html/user_nickname_modify.html')
//   );
// };
// exports.getModifyPasswordPage = (req, res) => {
//   res.sendFile(
//     path.join(__dirname, '../../../fe/Public/Html/user_password_modify.html')
//   );
// };

exports.getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: No user logged in' });
  }

  res.status(200).json({
    id: req.session.user.id,
    email: req.session.user.email,
    nickname: req.session.user.nickname,
    profile: req.session.user.profile,
  });
};

exports.createUser = (req, res) => {
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
};
exports.deleteUser = (req, res) => {
  const id = req.session.user.id;
  const filePathProfile = path.join(__dirname, `..${req.session.user.profile}`);
  userModel.deleteUserPostImage(id, (err, results) => {
    if (err) return res.status(500).send('get PostImage error');

    if (results) {
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
      res.status(500).send('회원탈퇴 실패');
      return;
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
};
exports.patchUser = (req, res) => {
  const { data, field } = req.body;

  const id = req.session.user.id;
  const patchData = {
    data,
    field,
    id,
  };
  userModel.patchUser(patchData, (err, results) => {
    if (err) {
      return res.status(500).send('Error Patch User');
    }
    res.status(200).send({ message: 'User Patch Success' });
  });
};

exports.login = (req, res) => {
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
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      return res.status(500).send('Error deleting session');
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    res.status(200).send('User successfully deleted');
  });
};
exports.fetchUsers = (req, res) => {
  userModel.getUsers((err, results) => {
    if (err) {
      res.status(500).send('can not access user info');
      return;
    }
    res.status(200).json(results);
  });
};

exports.checkDuplicated = (req, res) => {
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
};
