import express from "express";
import likesApi from "../services/likes.js";
const router = express.Router();

router.post('/', (req, res)=>{
    likesApi.likePost(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
        console.log("error while making post as liked");
    })
});

export default router;