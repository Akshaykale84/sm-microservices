import express from 'express';
import create from './routes/create.js';
import remove from './routes/remove.js';
const app = express();

app.listen(7000)

app.use('/likes/create', create);
app.use('/likes/remove', remove);
app.get('/likes', (req, res)=>{
    res.json("likes home");
});
