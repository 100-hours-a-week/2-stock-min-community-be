const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'database-1.cdwua6kiml9v.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'tozhaWkd741963*',
  port: 13306,
  database: 'Community',
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

module.exports = connection;
