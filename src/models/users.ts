import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        select: false

    },

    email: {
        type: String,
        required: true,
        unique: true

    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    }

}, { timestamps: true })

export default mongoose.model('User', userSchema);