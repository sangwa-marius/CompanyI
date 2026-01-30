const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    code:{
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },

    email: String,
    phone: String,
    address: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Company',companySchema);