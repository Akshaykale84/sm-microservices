import '../config/dbConfig.js';
import postSchema from '../models/posts.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import 'dotenv/config'
import aws from 'aws-sdk';
import { createClient } from 'redis';
import { commandOptions } from 'redis';

const publisher = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});
publisher.on('error', err => console.log('Redis Client Error', err));
await publisher.connect()
const insertToQueue = async (data)=>{
    await publisher.lPush("like-queue", JSON.stringify(data));
    await publisher.lPush("comm-queue", JSON.stringify(data))
}

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

function getUid() {
    const id = `post-${uuid()}`;
    return id;
}

const uploadToS3 = async (file, fileName) => {
    if (!file) {
        return 'No file uploaded.';
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `posts/${fileName}.png`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    // Upload the file to S3
    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading to S3:', err);
            return 'Error uploading file to S3.'
        }

        const fileUrl = data.Location;

        console.log('File uploaded to S3:', fileUrl);
        // console.log(req.body.userId);
        return fileUrl;
    });
}

class PostApi {
    static async createPost(data) {
        data.postId = getUid();
        data.type = 'POST_LIKE_INSERT'
        return new Promise((resolve, reject) => {
            try {
                const post = new postSchema(data);
                const result = post.save();
                // axios.post('http://localhost:7000/likes/create', data)
                //     .then((value) => { }) //Have to write log for like creation
                //     .catch((e) => { })
                insertToQueue(data).then(()=>{
                    console.log('inserted');
                }).catch((e)=>{
                    console.log(e);
                })
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("error while registering the post into DB")
            }
        })
    }

    static async getPostByUser(userId) {
        return new Promise((resolve, reject) => {
            postSchema.find({ userId: userId }).sort({ createdAt: -1 }).then(data => {
                if (data) {
                    resolve(data)
                }
                else {
                    reject('error')
                }
            })
        })
    }

    static async deletePostByUserId(data) {
        data.type = 'POST_LIKE_REMOVE'
        return new Promise((resolve, reject) => {
            postSchema.deleteOne({ postId: data.postId, userId: data.userId }).then(res => {
                if (res) {
                    // const like = { postId: postId }
                    // axios.delete('http://localhost:7000/likes/remove', { data: data})
                    //     .then((value) => { }) //Have to write log for like removal
                    //     .catch((e) => { })
                    insertToQueue(data).then(()=>{
                        console.log('inserted');
                    }).catch((e)=>{
                        console.log(e);
                    })

                    resolve(res)
                }
            }).catch(e => {
                reject(e)
            })
        })
    }
}

export default PostApi;