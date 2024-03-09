import express from 'express';
import userApi from '../services/users.js'
const router = express.Router();

router.get('/', (req, res)=>{
    userApi.sendOtp(req.body).then((value)=>{
        res.send(value);
    }).catch((e)=>{
        res.send(e);
    })
});

export default router;