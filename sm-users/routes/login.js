import express from 'express';
import userApi from '../services/users.js'
const router = express.Router();

router.get('/', (req, res)=>{
    userApi.login(req.body).then((value)=>{
        res.send(value);
    }).catch((e)=>{
        res.status(500).send('error');
        console.log('error while login')
    })
});

export default router;