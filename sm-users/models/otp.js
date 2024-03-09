import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    type: String

}, {
    timestamps: true,
});

otpSchema.index({createdAt: 1},{expireAfterSeconds: 600});

export default mongoose.model('otps', otpSchema);