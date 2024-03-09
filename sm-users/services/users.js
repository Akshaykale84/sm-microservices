import '../config/dbConfig.js';
import userSchema from '../models/user.js';
import encrypt from '../services/encryption.js'
import Mails from './mails.js';
import otpSchema from '../models/otp.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { createClient, commandOptions } from 'redis';

const subscriber = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const publisher = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});
subscriber.on('error', err => console.log('Redis Client Error', err));
publisher.on('error', err => console.log('Redis Client Error', err));
await publisher.connect();

function getUid() {
    const id = `user-${uuid()}`;
    return id;
}

const isUserNameTaken = async (userName) => {
    const result = await userSchema.findOne({ userName: userName });
    // console.log(`in function ${!!result}`); //logger required
    return !!result;
}
const isExistingUser = async (email) => {
    const result = await userSchema.findOne({ email: email });
    // console.log(`in function ${!!result}`); //logger required
    return !!result;
}

const insertToQueue = async (data) => {
    await publisher.lPush("mail-queue", JSON.stringify(data));
}

const registerBgTasks = async (data) => {
    axios.post('http://localhost:12000/connect/create', { userId: data.userId })
        .then((value) => {
            console.log(`connection created for user: ${data.userId}`);
            Mails.sendWelcomeMail(data.userName, data.email)
        }) //Have to write log for connection creation
        .catch((e) => { console.log(`error while creating connection for user: ${data.userId}`); })
}

class UserApi {
    static async sendOtp(data) {
        data.type = 'OTP_MAILS'
        const isExUser = await isExistingUser(data.email);
        return new Promise((resolve, reject) => {
            console.log(isExUser)
            if (!isExUser) {
                // Mails.sendOTP(data.email)
                //     .then((result) => {
                //         resolve(result)
                //         console.log(`OTP sent to ${data.email}`);
                //     })
                //     .catch((error) => {
                //         console.error('Error:', error.message);
                //         reject(error.message)
                //     });
                insertToQueue(data).then(() => {
                    console.log('inserted');
                    resolve("success")
                })
            }
            else {
                resolve(`user already exists with ${data.email}`)
            }
        })
    }

    static async verifyOtp(data) {
        return new Promise((resolve, reject) => {
            try {
                otpSchema.findOne({ email: data.email, otp: data.otp }).then(result => {
                    if (result) {
                        resolve("MATCHED")
                    } else {
                        resolve("NOT_MATCHED")
                    }
                })
            } catch (e) {
                reject("error")
            }
        })
    }

    static async login(data) {
        return new Promise((resolve, reject) => {
            isExistingUser(data.email).then(async (isRegistered) => {
                if (isRegistered) {
                    const user = await userSchema.findOne({ email: data.email });
                    encrypt.validateUser(data.password, user.password).then(res => {
                        res ? resolve(user) : reject('incorrect password');
                    })
                }
                else {
                    resolve(`User not found with ${data.email}`)
                }
            })
        })
    }

    static async register(data) {
        data.userId = getUid();
        data.type = 'REGISTER_BG_TASKS'
        const hash = await encrypt.encryptPass(data.password);
        data.password = hash
        const isUNameTaken = await isUserNameTaken(data.userName);
        return new Promise((resolve, reject) => {
            if (!isUNameTaken) {
                try {
                    const user = new userSchema(data);
                    const result = user.save(); //logger required
                    insertToQueue(data).then(() => {
                        console.log('inserted');
                    })
                    // axios.post('http://localhost:12000/connect/create', { userId: data.userId })
                    //     .then((value) => {
                    //         console.log(`connection created for user: ${data.userId}`);
                    //         Mails.sendWelcomeMail(data.userName, data.email)
                    //     }) //Have to write log for connection creation
                    //     .catch((e) => { console.log(`error while creating connection for user: ${data.userId}`); })
                    resolve(result);
                } catch (e) {
                    console.log(e);
                    reject(`error while registering user: ${data.userId}`); //logger required
                }
            }
            else {
                resolve(`user already exists with ${data.userName}`)
            }
        })
    }
}

async function main() {
    console.log('redis');
    await subscriber.connect();
    while (1) {
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'mail-queue',
            0
        );
        console.log(JSON.parse(response.element));
        const data = JSON.parse(response.element);
       
        switch (data.type) {
            case 'OTP_MAILS':
                Mails.sendOTP(data.email)
                    .then((result) => {
                        console.log(`OTP sent to ${data.email}`);
                    })
                    .catch((error) => {
                        console.error('Error:', error.message);
                    });
                break;
            case 'REGISTER_BG_TASKS':
                registerBgTasks(data).then(()=>{
                    console.log(`BG tasks completed for ${data.userId}`);
                })
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

export default UserApi;