import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    comments: Array

}, {
    timestamps: true,
});

export default mongoose.model('posts', postSchema);