import express from 'express';
import register from './routes/register.js';
import login from './routes/login.js';
import cors from 'cors'
const app = express();

app.use(cors());
app.use(express.json());

app.get('/user', (req, res)=>{
    res.send("users home");
});

app.use('/user/register', register);
app.use('/user/login', login);
app.listen(10000);