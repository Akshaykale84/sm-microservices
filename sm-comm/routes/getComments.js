import express from "express";
import commApi from '../services/comm.js';
const router = express.Router();

router.get('/', (req, res) => {
    commApi.getCommentsByPost(req.body.postId).then(value => {
        res.send(value);
    }).catch((e) => {
        res.status(500).send('error');
    });
})

export default router;
