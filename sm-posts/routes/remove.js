import express from 'express';
import postApi from '../services/post.js'
const router = express.Router();

router.delete('/', (req, res)=>{
    console.log(req.body);
    postApi.deletePostByUserId(req.body).then((data) =>{
        res.send(data);
    }).catch(e =>{
        res.send('error')
        console.log('error while deleting the post by userId');
        console.log(e);
    })
});

export default router;