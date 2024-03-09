import express from 'express';
import postApi from '../services/post.js';

const router = express.Router();

router.post('/', (req, res)=>{
    postApi.createPost(req.body).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send("error while creating the post");
    })
});

// router.get('/get',postApi.getPost);

export default router;