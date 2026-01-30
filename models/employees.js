const mongoose = require('mongoose');

const employees = new mongoose.Schema({

    names:{
        type:String,
        required:true,
        trim: true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    age:{
        type:Number,
        required:true,
    },

    salary:{
        type:Number,
        required:true,
    },

    department:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Department',
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Employee',employees);