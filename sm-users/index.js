import express from 'express';
import create from './routes/create.js';
const app = express();

app.get('/user', (req, res)=>{
    res.send("users home");
});

app.use('/user/create', create);
app.listen(10000);