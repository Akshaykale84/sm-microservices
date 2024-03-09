import getConn from'../config/dbConfig.js';
import postSchema from '../models/posts.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
// import { JsonStreamStringify } from 'json-stream-stringify';
import JSONStream from 'JSONStream';

function getUid() {
    const id = `post-${uuid()}`;
    return id;
}

class PostApi {
    static createPost(data) {
        data.postId = getUid();
        const db = getConn();
        return new Promise((resolve, reject) => {
            try {
                const text = new postSchema(data);
                const result = text.save();
                axios.post('http://localhost:7000/likes/create', data)
                    .then((value) => { }) //Have to write log for like creation
                    .catch((e) => { })
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("messed up")
            } finally {
                db.disconnect();
            }
        })
    }

    static async getPostByUser(userId) {
        return new Promise((resolve, reject) => {
            postSchema.find({userId: userId}).sort({createdAt: -1}).then(data => {
                if(data){
                    resolve(data)
                }
                else{
                    reject('error')
                }
            })
        })
    }
}

export default PostApi;