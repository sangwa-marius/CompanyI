import mongoose from 'mongoose';

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

    phone: String,

    department:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Department',
       
    },

    role:{
        type: mongoose.Schema.ObjectId,
        ref: 'Role',
    },

    status:{
        type: String,
        enum: ['ACTIVE','INACTIVE','SUSPENDED'],
        default: 'ACTIVE'
    },
    companies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    }],

    hiredAt:Date,
    
}, {timestamps: true})

export default mongoose.model('Employee',employees);