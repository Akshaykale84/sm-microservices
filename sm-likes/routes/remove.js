import express from 'express';
import LikesApi from '../services/likes.js';
const router = express.Router();

router.delete('/', (req, res)=>{
    console.log(req.body);
    LikesApi.removeLikeByPostId(req.body).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
        res.status(500).send("error")
    })
});

export default router;