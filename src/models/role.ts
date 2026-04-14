import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },

    permissions:[{
        type: String,
    }],

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }

},{timestamps: true});

export default mongoose.model('Role',roleSchema);