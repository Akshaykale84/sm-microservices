import mongoose from "mongoose";

const commSchema = new mongoose.Schema({
    uid: String,
    userId: String,
    postId: String,
    text: String,
});

export default mongoose.model('comm', commSchema);