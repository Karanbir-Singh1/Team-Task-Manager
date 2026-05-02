import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    deadline: { type: Date, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ admin: 1, deadline: 1 });
projectSchema.index({ members: 1 });

export default mongoose.model('Project', projectSchema);
