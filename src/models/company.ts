import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    email: String,
    phone: String,
    address: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export default mongoose.model('Company',companySchema);