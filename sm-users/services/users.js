import getConn from '../config/dbConfig.js';
import userSchema from '../models/user.js';
import encrypt from '../services/encryption.js'
import sendOTP from './mails.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

function getUid() {
    const id = `user-${uuid()}`;
    return id;
}

const isUserNameTaken = async (userName) => {
    const result = await userSchema.findOne({ userName: userName });
    console.log(`in function ${!!result}`); //logger required
    return !!result;
}
const isExistingUser = async (email) => {
    const result = await userSchema.findOne({ email: email });
    // console.log(`in function ${!!result}`); //logger required
    return !!result;
}

class UserApi {
    static async sendOtp(data) {
        // data.userId = getUid();
        const db = getConn()
        // const hash = await encrypt.encryptPass(data.password);
        // data.password = hash
        const isExUser = await isExistingUser(data.email);
        const isUNameTaken = await isUserNameTaken(data.userName);
        return new Promise((resolve, reject) => {
            console.log(isExUser)
            console.log(isUNameTaken);
            if (!isExUser && !isUNameTaken) {
                sendOTP(data.email)
                    .then((otp) => {
                        resolve(otp)
                        console.log(`OTP sent to ${data.email}: ${otp}`);

                    })
                    .catch((error) => {
                        console.error('Error:', error.message);
                        reject(error.message)
                    });
            }
            else if (isExUser && isUNameTaken) {
                reject(`user already exists with email: ${data.email} and username: ${data.userName}`)
            }
            else if (isUNameTaken && !isExUser) {
                reject(`user already exists with username: ${data.userName}`)
            }
            else if (isExUser) {
                reject(`user already exists with email: ${data.email}`)
            }

        })
    }

    static async login(data) {
        const db = getConn()
        return new Promise((resolve, reject) => {
            isExistingUser(data.email).then(async (isRegistered) => {
                if (isRegistered) {
                    const user = await userSchema.findOne({ email: data.email });
                    encrypt.validateUser(data.password, user.password).then(res => {
                        res ? resolve(user) : reject('incorrect password');
                    })
                }
                else {
                    reject(`User not found with ${data.email}`)
                }
            })
        })
    }

    static async register(data) {
        data.userId = getUid();
        const db = getConn()
        const hash = await encrypt.encryptPass(data.password);
        data.password = hash
        return new Promise((resolve, reject) => {
            try {
                const user = new userSchema(data);
                const result = user.save(); //logger required
                axios.post('http://localhost:12000/connect/create', { userId: data.userId })
                    .then((value) => { console.log(`connection created for user: ${data.userId}`); }) //Have to write log for connection creation
                    .catch((e) => { })
                resolve(result);
            } catch (e) {
                reject(`error while registering user: ${data.userId}`); //logger required
            } finally {
                db.disconnect();
            }
        })
    }
}

export default UserApi;