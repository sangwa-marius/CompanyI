import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
}, { timestamps: true });


departmentSchema.index({ name: 1, company: 1 }, { unique: true });

export default mongoose.model('Department', departmentSchema);
