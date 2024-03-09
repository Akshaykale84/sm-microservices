import '../config/dbConfig.js';
import postSchema from '../models/posts.js';
import { v4 as uuid } from 'uuid';

function getUid() {
    const id = `post-${uuid()}`;
    return id;
}

class PostApi{
    static createPost(data){
        data.postId = getUid();
        return new Promise((resolve, reject)=>{
            try {
                const text = new postSchema(data);
                const result = text.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("messed up")
            }
        })
    }
}

export default PostApi;