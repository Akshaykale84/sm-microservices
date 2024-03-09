import '../config/dbConfig.js';
import userSchema from '../models/user.js';
import { v4 as uuid } from 'uuid';

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
    console.log(`in function ${!!result}`); //logger required
    return !!result;
}
class UserApi {
    static async register(data) {
        data.userId = getUid();
        const isExUser = await isExistingUser(data.email);
        const isUNameTaken = await isUserNameTaken(data.userName);
        return new Promise((resolve, reject) => {
            console.log(isExUser)
            console.log(isUNameTaken);
            if (!isExUser && !isUNameTaken) {
                try {
                    const user = new userSchema(data);
                    const result = user.save(); //logger required
                    resolve(result);
                } catch (e) {
                    reject(`error while registering user: ${data.userId}`); //logger required
                }
            }
            else if (isExUser && isUNameTaken) {
                reject(`user already exists with email: ${data.email} and username: ${data.userName}`)
            }
            else if (isUNameTaken && !isExUser) {
                reject(`user already exists with username: ${data.userName}`)
            }
            reject(`user already exists with email: ${data.email}`)

        })
    }
}

export default UserApi;