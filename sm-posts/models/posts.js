import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    likes: Number,
    caption: String,
    isLiked: Boolean,
    imgUrl: String

}, {
    timestamps: true,
});

export default mongoose.model('posts', postSchema);