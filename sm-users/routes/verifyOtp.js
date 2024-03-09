import express from 'express';
import userApi from '../services/users.js'
const router = express.Router();

router.get('/', (req, res)=>{
    console.log(req.body);
    userApi.verifyOtp(req.body).then((result)=>{
        console.log(req.body);
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
        console.log('error while validating the otp');
    })
});

export default router;