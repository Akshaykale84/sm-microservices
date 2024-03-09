import express from 'express';
import cors from 'cors';
import create from './routes/create.js';
import remove from './routes/remove.js';
import reply from './routes/reply.js';
import getComment from './routes/getComments.js';

const app = express();
app.use(cors())
app.use(express.json());
// app.use(cors());
app.use('/comm/create', create);
app.use('/comm/remove', remove);
app.use('/comm/reply', reply);
app.use('/comm/get', getComment)
app.get('/',(req, res)=>{
    res.send("sm-comm");
});
app.get('/comm',(req, res)=>{
    res.send("sm-comm//");
});


app.listen(8000)