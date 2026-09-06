import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  entityName: { type: String, required: true },
  details: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
