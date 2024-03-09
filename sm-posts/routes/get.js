import express from 'express';
import postApi from '../services/post.js';

const router = express.Router();

router.get('/', (req, res)=>{
    postApi.getPostByUser(req.body.userId).then(data =>{
        res.send(data);
    }).catch(e =>{
        res.send(e)
    })
})

export default router;