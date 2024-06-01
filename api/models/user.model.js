import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        uniquw: true,
        min: 6,
        max: 24,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 24,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 24,
    },
    // date: {
    //     type: Date,
    //     default: Date.now,
    // },
   
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;