import express from 'express';
import createPost from './routes/create.js';
import removePost from './routes/remove.js';
const app = express();

app.use(express.json());
app.use('/posts/create', createPost);
app.use('/posts/remove', removePost);

app.get('/posts', (req, res) => {
    res.send("post home");
});

app.listen(9000);