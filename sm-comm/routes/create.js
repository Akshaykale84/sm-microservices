import express from "express";
import commApi from '../services/comm.js';

const router = express.Router();

router.post('/', (req, res)=>{
    commApi.createComm(req.body).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(500).send('error');
    });
})

export default router;