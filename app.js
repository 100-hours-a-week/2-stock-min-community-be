const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../be/server/routers/userRoutes');
const postsRoutes = require('../be/server/routers/postsRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));
app.use(express.static(path.join(__dirname, '../fe/Public')));

app.use(
  session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 360000,
    },
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
