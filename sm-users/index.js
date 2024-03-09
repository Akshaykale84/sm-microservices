import express from 'express';
import register from './routes/register.js';
import sendOtp from './routes/sendOtp.js';
import verifyOtp from './routes/verifyOtp.js'
import login from './routes/login.js';
import cors from 'cors'
import './services/users.js'
const app = express();

app.use(cors());
app.use(express.json());

app.get('/users', (req, res)=>{
    res.send("users home");
});

app.use('/users/register', register);
app.use('/users/login', login);
app.use('/users/sendOtp', sendOtp);
app.use('/users/verifyOtp', verifyOtp)
app.listen(11000);