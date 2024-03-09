import mongoose from "mongoose";

const commSchema = new mongoose.Schema({
    commId: String,
    userId: String,
    postId: String,
    text: String,
}, {
    timestamps: true,
}
);

export default mongoose.model('comms', commSchema);