import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './server/routers/userRoutes.js';
import postsRoutes from './server/routers/postsRouter.js';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));
// app.use(express.static(path.join(__dirname, '../fe/Public')));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
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
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
