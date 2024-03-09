import express from 'express';
import cors from 'cors'
import follow from './routes/follow.js'
import unFollow from './routes/unFollow.js'
import create from './routes/create.js';
const app = express();

app.listen(12000)
app.use(cors())
app.use(express.json())

app.use('/connect/follow', follow);
app.use('/connect/unfollow', unFollow);
app.use('/connect/create', create);

app.get('/', (req, res)=>{
    res.send('hello from follow')
})