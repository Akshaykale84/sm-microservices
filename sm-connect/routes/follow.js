import express from 'express';
import connectApi from '../services/connect.js';
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('follow')
})

router.post('/',(req, res)=>{
    connectApi.follow(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
    })
})

export default router;