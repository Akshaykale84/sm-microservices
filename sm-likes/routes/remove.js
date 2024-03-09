import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
    res.json("likes remove");
});

export default router;