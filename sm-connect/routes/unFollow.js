import express from 'express';
import connectApi from '../services/connect.js';
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('unfollow')
})

router.post('/',(req, res)=>{
    connectApi.unFollow(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
    })
})

export default router;