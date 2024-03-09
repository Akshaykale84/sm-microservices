import express from 'express';
import likesApi from '../services/likes.js'

const router = express.Router();

router.get('/', (req, res)=>{
    res.json("likes create");
});

router.post('/', (req, res)=>{
    likesApi.entryInLikes(req.body).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send("error while creating the like");
    })
});

export default router;