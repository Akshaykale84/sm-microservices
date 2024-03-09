import express from "express";
import commApi from '../services/comm.js';

const router = express.Router();

router.post('/', (req, res)=>{
    commApi.createComm(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.send(e);
    });
})

export default router;