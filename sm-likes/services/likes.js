import '../config/dbConfig.js';
import likesSchema from '../models/likes.js';
import { createClient, commandOptions } from 'redis';

const subscriber = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

subscriber.on('error', err => console.log('Redis Client Error', err));

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
        console.log('in function', data.postId);
        const likesData = {};
        likesData.postId = data.postId;
        likesData.userId = data.userId;
        likesData.noOfLikes = 0;
        likesData.likes = [];
        return new Promise((resolve, reject) => {
            try {
                const like = new likesSchema(likesData);
                const result = like.save();
                console.log("like created for", likesData.postId);
                resolve(result);
            } catch (err) {
                console.log("reject", err);
                reject("messed up")
            }
        })
    }

    static likePost(data) {
        const postId = data.postId;
        const userId = data.userId;

        return new Promise((resolve, reject) => {
            try {
                const result = likesSchema.updateOne({ postId: data.postId }, { $push: { likes: data.userId }, $inc: { noOfLikes: 1 } });
                resolve(result);
            } catch (e) {
                console.log("reject");
                reject("messed up")
            }
        })
    }

    static unLikePost(data) {
        const postId = data.postId;
        const userId = data.userId;

        return new Promise((resolve, reject) => {
            try {
                const result = likesSchema.updateOne({ postId: data.postId }, { $pull: { likes: data.userId }, $inc: { noOfLikes: -1 } });
                resolve(result);
            } catch (e) {
                console.log("reject");
                reject("messed up")
            }
        })
    }

    static removeLikeByPostId(data) {
        console.log(`this is data ${data}`)
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

async function main() {
    console.log('redis');
    await subscriber.connect();
    while (1) {
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'like-queue',
            0
        );
        // console.log(JSON.parse(response.element));
        const data = JSON.parse(response.element);
        switch (data.type) {
            case 'POST_LIKE_INSERT':
               await LikesApi.entryInLikes(data)
                break;
            case 'POST_LIKE_REMOVE':
               await LikesApi.removeLikeByPostId(data)
                break;
            case 'COMM_LIKE_INSERT':

                break;
            case 'COMM_LIKE_REMOVE':

                break;
            default:

                break;
        }
        // LikesApi.entryInLikes(data)
    }

}

main();

export default LikesApi;

