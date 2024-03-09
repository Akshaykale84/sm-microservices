import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    photoUrl: String,
    userId: String

});

export default mongoose.model('users', userSchema);