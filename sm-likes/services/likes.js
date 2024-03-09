import '../config/dbConfig.js';
import likesSchema from '../models/likes.js';

function entryInLikes(data){
    const likesData={};
    likesData.postId = data.postId;
    likesData.postOwner = data.postOwner;
    likesData.noOfLikes = 0;
    likesData.likes = [];
    return new Promise((resolve, reject)=>{
        try {
            const text = new likesSchema(likesData);
            const result = text.save();
            resolve(result);
        } catch (err) {
            console.log("reject");
            reject("messed up")
        }
    })
}
const getLike = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            // const text = new likesSchema(likesData);
            const result = likesSchema.find(data);
            resolve(result);
        } catch(e){
            console.log("reject");
            reject("messed up")
        }
    })
}

const updateLike = (data)=>{

}
class LikesApi{

    static entryInLikes(data){
        const likesData={};
        likesData.postId = data.postId;
        likesData.userId = data.userId;
        likesData.noOfLikes = 0;
        likesData.likes = [];
        return new Promise((resolve, reject)=>{
            try {
                const text = new likesSchema(likesData);
                const result = text.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("messed up")
            }
        })
    }

    static likePost(data){
        const postId = data.postId;
        const userId = data.userId;

        return new Promise(async(resolve, reject)=>{
            try{
                // const result = await getLikes(data);
                getLike(data).then((result)=>{
                    result[0].likes.push(userId);
                    result[0].noOfLikes += 1;
                    console.log(result);
                    resolve(result);
                })
            } catch(e){
                console.log("reject");
                reject("messed up")
            }
        })
    }
}

export default LikesApi;

