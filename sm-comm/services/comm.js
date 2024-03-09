import '../config/dbConfig.js';
import comm from '../models/comm.js';
import { v4 as uuid } from 'uuid';

function getUid() {
    const id = `comm-${uuid()}`;
    return id;
}


class CommApi {
    static createComm(data) {
        data.uid = getUid();
        return new Promise((resolve, reject) => {
            try {
                const text = new comm(data);
                const result = text.save();
                resolve(result);
            } catch (err) {
                console.log("reject");
                reject("messed up")
            }
        })
    }

    static getAllCommByPostId(postId) {

    }

    static getAllCommByUserId(userId) {

    }

    static removeCommById(id) {

    }

    static editCommById(id) {

    }



}


export default CommApi;