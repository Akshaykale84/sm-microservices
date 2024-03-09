import getConn from'../config/dbConfig.js';
import comm from '../models/comm.js';
import { v4 as uuid } from 'uuid';

function getUid() {
    const id = `comm-${uuid()}`;
    return id;
}


class CommApi {
    static createComm(data) {
        data.uid = getUid();
        const db = getConn()
        return new Promise((resolve, reject) => {
            try {
                const comment = new comm(data);
                const result = comment.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject(err)
            } finally {
                db.disconnect();
            }
        })
    }

    static getCommentsByPost(postId){
        const db = getConn()
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