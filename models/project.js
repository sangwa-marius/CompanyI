const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    manage:{
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

module.exports = mongoose.model('Project',projectSchema);