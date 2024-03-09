import '../config/dbConfig.js';
import comm from '../models/comm.js';
import { v4 as uuid } from 'uuid';

function getUid() {
    const id = `comm-${uuid()}`;
    return id;
}


class CommApi {
    static createComm(data) {
        data.uid = getUid();
        return new Promise((resolve, reject) => {
            try {
                const comment = new comm(data);
                const result = comment.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject(err)
            }
        })
    }

    static getCommentsByPost(postId){
        return new Promise((resolve, reject)=>{
            comm.find({postId: postId}).sort({createdAt: -1}).then(data => {
                if(data){
                    resolve(data)
                }
                else{
                    reject('errrrr')
                }
            })
        })

    }
}


export default CommApi;