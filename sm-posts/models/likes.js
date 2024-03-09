import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    noOfLikes: Number,
    likes: Array,
      
});

export default mongoose.model('likes', likesSchema);