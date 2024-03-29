import express from 'express';
import create from './routes/create.js';
import remove from './routes/remove.js';
import postLike from './routes/postLike.js';
import postUnLike from './routes/postUnlike.js';
import cors from 'cors';
import './services/likes.js';
const app = express();
app.listen(7000)
app.use(cors());
app.use(express.json());
app.use('/likes/create', create);
app.use('/likes/remove', remove);
app.use('/likes/postlike', postLike);
app.use('/likes/postunlike', postUnLike);
app.get('/likes', (req, res)=>{
    res.json("likes home");
});
