import '../config/dbConfig.js';
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
            }
        })
    }

    static async getPost(req, res) {

        const cursor = await postSchema.find({}).cursor()
            .pipe(JSONStream.stringify()).pipe(res)
            // .pipe(res.type('stream+json'))
            .on('data', (doc) => {
                // console.log(doc);
                // setInterval(function (){res.write(doc)}, 1000)
                res.json(doc)
            })
            .on('end', function () {
                res.end();
                console.log('Done!');
            });
        // let x = new JsonStreamStringify(cursor).pipe(res)
        // // x.on("data", (doc) => {
        // //     console.log('hh');
        // //     res.write(doc);
        // });
    }
}

export default PostApi;