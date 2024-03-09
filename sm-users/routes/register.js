import express from 'express';
import userApi from '../services/users.js';
const router = express.Router();

router.post('/', (req, res)=>{
    userApi.register(req.body).then((value)=>{
        res.send(value);
    }).catch((e)=>{
        res.status(500).send('error');
        console.log('error while registering');
    })
});

export default router;