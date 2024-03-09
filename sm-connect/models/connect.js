import mongoose from "mongoose";

const connectSchema = new mongoose.Schema({
    userId: String,
    followers: Array,
    following: Array,
    noOfFollowers: Number,
    noOfFollowings: Number
}, {
    timestamps: true,
}
);

export default mongoose.model('connection', connectSchema);