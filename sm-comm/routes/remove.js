import express from "express";
import CommApi from "../services/comm.js";
const router = express.Router();

router.delete('/', (req, res) => {
    console.log(`hello${req.body}`);
    CommApi.deleteCommentByUserId(req.body).then((data) => {
        res.send(data);
    }).catch(e => {
        console.log(e);
        res.send('error')
        console.log('error while deleting the comment by userId');
    })
})

export default router;
