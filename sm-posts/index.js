import express from 'express';
import createPost from './routes/create.js';
import removePost from './routes/remove.js';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/posts/create', createPost);
app.use('/posts/remove', removePost);

app.get('/posts', (req, res) => {
    res.send("post home");
});

app.listen(9000);