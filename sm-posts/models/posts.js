import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postId: String,
    postOwner: String,
    comments: Array,
    likes: Array,
    createdOn: String,
      
});

export default mongoose.model('posts', postSchema);