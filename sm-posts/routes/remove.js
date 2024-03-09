import express from 'express';
import postApi from '../services/post.js'
const router = express.Router();

router.delete('/', (req, res)=>{
    postApi.deletePostByUserId(req.body.postId, req.body.userId).then((data) =>{
        res.send(data);
    }).catch(e =>{
        res.send('error')
        console.log('error while deleting the post by userId');
    })
});

export default router;