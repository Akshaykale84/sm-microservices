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

const paymentProxy = createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true
});

app.use('/comm', commProxy);
app.use('/likes', likesProxy);
app.use('/payments', paymentProxy);


app.listen(5000);