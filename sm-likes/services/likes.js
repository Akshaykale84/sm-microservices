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
            const result = likesSchema.findOne({postId: data.postId});
            resolve(result);
        } catch(e){
            console.log("reject");
            reject("messed up")
        }
    })
}

const updateLike = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            const result = likesSchema.updateOne({postId: data.postId}, {$set:{noOfLikes: data.noOfLikes, likes: data.likes}});
            resolve(result);
        } catch(e){
            reject("error while adding like");
        }
    })
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
                const like = new likesSchema(likesData);
                const result = like.save();
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

        return new Promise((resolve, reject)=>{
            try{
                // getLike(data).then((result)=>{
                //     result.likes.push(userId);
                //     result.noOfLikes += 1;
                //     updateLike(result);
                //     resolve(result);
                // })
                const result = likesSchema.updateOne({postId: data.postId}, {$push: {likes: data.userId}, $inc: {noOfLikes: 1}});
                resolve(result);
            } catch(e){
                console.log("reject");
                reject("messed up")
            }
        })
    }

    static unLikePost(data){
        const postId = data.postId;
        const userId = data.userId;

        return new Promise((resolve, reject)=>{
            try{
                // getLike(data).then((result)=>{
                //     result.likes.pop(userId);
                //     result.noOfLikes -= 1;
                //     updateLike(result);
                //     resolve(result);
                // })
                const result = likesSchema.updateOne({postId: data.postId}, {$pull: {likes: data.userId}, $inc: {noOfLikes: -1}});
                resolve(result);
            } catch(e){
                console.log("reject");
                reject("messed up")
            }
        })
    }
}

export default LikesApi;

