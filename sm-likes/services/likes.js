import getConn from '../config/dbConfig.js';
import likesSchema from '../models/likes.js';

function entryInLikes(data) {
    const likesData = {};
    likesData.postId = data.postId;
    likesData.postOwner = data.postOwner;
    likesData.noOfLikes = 0;
    likesData.likes = [];
    return new Promise((resolve, reject) => {
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
const getLike = (data) => {
    return new Promise((resolve, reject) => {
        try {
            // const text = new likesSchema(likesData);
            const result = likesSchema.findOne({ postId: data.postId });
            resolve(result);
        } catch (e) {
            console.log("reject");
            reject("messed up")
        }
    })
}

const updateLike = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const result = likesSchema.updateOne({ postId: data.postId }, { $set: { noOfLikes: data.noOfLikes, likes: data.likes } });
            resolve(result);
        } catch (e) {
            reject("error while adding like");
        }
    })
}
class LikesApi {

    static entryInLikes(data) {
        const db = getConn()
        const likesData = {};
        likesData.postId = data.postId;
        likesData.userId = data.userId;
        likesData.noOfLikes = 0;
        likesData.likes = [];
        return new Promise((resolve, reject) => {
            try {
                const like = new likesSchema(likesData);
                const result = like.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("messed up")
            } finally {
                db.disconnect();
            }
        })
    }

    static likePost(data) {
        const db = getConn()
        const postId = data.postId;
        const userId = data.userId;

        return new Promise((resolve, reject) => {
            try {
                const result = likesSchema.updateOne({ postId: data.postId }, { $push: { likes: data.userId }, $inc: { noOfLikes: 1 } });
                resolve(result);
            } catch (e) {
                console.log("reject");
                reject("messed up")
            } finally {
                db.disconnect();
            }
        })
    }

    static unLikePost(data) {
        const db = getConn()
        const postId = data.postId;
        const userId = data.userId;

        return new Promise((resolve, reject) => {
            try {
                const result = likesSchema.updateOne({ postId: data.postId }, { $pull: { likes: data.userId }, $inc: { noOfLikes: -1 } });
                resolve(result);
            } catch (e) {
                console.log("reject");
                reject("messed up")
            } finally {
                db.disconnect();
            }
        })
    }

    static removeLikeByPostId(data) {
        console.log(data)
        const db = getConn()
        return new Promise((resolve, reject) => {
            likesSchema.deleteOne({ postId: data.postId }).then(result => {
                resolve(result)
                console.log(`like deleted for ${data.postId}`);
            }).catch(e => {
                console.log(`error while deleting like for ${data.postId}`);
                reject(e)
            })
        })
    }
}

export default LikesApi;

