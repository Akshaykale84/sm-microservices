import express from 'express';
import userApi from '../services/users.js'
const router = express.Router();

router.post('/', (req, res)=>{
    userApi.sendOtp(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
        console.log('error while sending otp');
    })
});

export default router;