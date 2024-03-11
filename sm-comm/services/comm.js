import '../config/dbConfig.js';
import comm from '../models/comm.js';
import { v4 as uuid } from 'uuid';
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

function getUid() {
    const id = `comm-${uuid()}`;
    return id;
}


class CommApi {
    static createComm(data) {
        data.commId = getUid();
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

    static getCommentsByPost(postId) {
        return new Promise((resolve, reject) => {
            comm.find({ postId: postId }).sort({ createdAt: -1 }).then(data => {
                if (data) {
                    resolve(data)
                }
                else {
                    reject('errrrr')
                }
            })
        })

    }

    static async deleteCommentByUserId(data) {
        return new Promise((resolve, reject) => {
            console.log(data);
            comm.deleteOne({ commId: data.commId, userId: data.userId }).then(data => {
                if (data) {
                    resolve(data)
                }
            }).catch(e => {
                console.log(e);
                reject(e)
            })
        })
    }

    static async deleteCommentsByPostId(data){
        return new Promise((resolve, reject) => {
            comm.deleteMany({postId: data.postId}).then(data => {
                if(data) {
                    resolve(data)
                }
            }).catch(e => {
                console.log(e);
                reject(e);
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
            'comm-queue',
            0
        );
        console.log(JSON.parse(response.element));
        const data = JSON.parse(response.element);
        await CommApi.deleteCommentsByPostId(data)
        switch (data.type) {
            case 'POST_LIKE_INSERT':
                
                break;
            case 'POST_LIKE_REMOVE':
            
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

export default CommApi;