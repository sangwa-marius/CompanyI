import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    }],

    status:{
        type: String,
        enum: ['PLANNED','ONGOING','COMPLETED'],
        default: 'PLANNED'
    },
},{timestamps: true});

export default mongoose.model('Project',projectSchema);