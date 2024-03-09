import express from 'express';
import connectApi from '../services/connect.js'
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('create')
})

router.post('/', (req, res)=>{
    connectApi.create(req.body.userId).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send(`error while creating the connection for ${req.body.userId}`);
    })
});

export default router;