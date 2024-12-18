const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../be/server/routers/userRoutes');
const postsRoutes = require('../be/server/routers/postsRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));
// app.use(express.static(path.join(__dirname, '../fe/Public')));

app.use(
  session({
    secret: '123456789',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  })
);
app.use(
  cors({
    origin: 'http://localhost:5500', // 특정 프론트엔드 URL만 허용
    credentials: true,
  })
);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1', userRoutes);
app.use('/api/v1/posts', postsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
