import bcrypt from 'bcrypt';

const saltRounds = 10

class encryption {
    static encryptPass(password) {
        return new Promise((resolve, reject) => {
            bcrypt
                .genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(password, salt)
                })
                .then(hash => {
                    resolve(hash)
                })
                .catch(err => console.error(err.message))
        })
    }

    static validateUser(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt
                .compare(password, hash)
                .then(res => {
                    console.log(res) // return true
                    resolve(res)
                })
                .catch(err => console.error(err.message))
        })
    }
}

export default encryption;