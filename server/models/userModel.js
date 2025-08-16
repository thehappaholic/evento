import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetPasswordOtp: {type: String, default: ''},
    resetPasswordOtpExpireAt: {type: Number, default: 0},
    isPasswordReset: {type: Boolean, default: false},
})

const UserModel = mongoose.models.user  || mongoose.model('User', userSchema);

export default UserModel;