import express from "express";
import commApi from '../services/comm.js';

const router = express.Router();

router.post('/',  async (req, res)=>{
    commApi.createComm(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.send("error");
    });
})

export default router;