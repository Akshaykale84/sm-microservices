import express from 'express';
import create from './routes/create.js';
import remove from './routes/remove.js';
import reply from './routes/reply.js';

const app = express();

app.use('/create', create);
app.use('/remove', remove);
app.use('/reply', reply);
app.get('/',(req, res)=>{
    res.send("sm-comm");
});

app.listen(4000)