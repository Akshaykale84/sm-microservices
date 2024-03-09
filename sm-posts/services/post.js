import getConn from '../config/dbConfig.js';
import postSchema from '../models/posts.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import 'dotenv/config'
import aws from 'aws-sdk';


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
        const db = getConn();
        return new Promise((resolve, reject) => {
            try {
                const post = new postSchema(data);
                const result = post.save();
                axios.post('http://localhost:7000/likes/create', data)
                    .then((value) => { }) //Have to write log for like creation
                    .catch((e) => { })
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("error while registering the post into DB")
            } finally {
                db.disconnect();
            }
        })
    }

    static async getPostByUser(userId) {
        const db = getConn();
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

    static async deletePostByUserId(postId, userId) {
        const db = getConn();
        return new Promise((resolve, reject) => {
            postSchema.deleteOne({ postId: postId, userId: userId }).then(data => {
                if (data) {
                    const like = { postId: postId }
                    axios.delete('http://localhost:7000/likes/remove', { data: { postId: postId }})
                        .then((value) => { }) //Have to write log for like creation
                        .catch((e) => { })
                    resolve(data)
                }
            }).catch(e => {
                reject('error')
            })
        })
    }
}

export default PostApi;