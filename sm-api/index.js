import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.send("sm-api");
});

const commProxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true
});

const likesProxy = createProxyMiddleware({
  target: 'http://localhost:7000',
  changeOrigin: true
});

const postsProxy = createProxyMiddleware({
  target: 'http://localhost:9000',
  changeOrigin: true
});

const usersProxy = createProxyMiddleware({
  target: 'http://localhost:11000',
  changeOrigin: true
})

app.use('/comm', commProxy);
app.use('/likes', likesProxy);
app.use('/posts', postsProxy);
app.use('/users', usersProxy);


app.listen(5000);