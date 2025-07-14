import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  color: { type: String, required: true, default: 'blue' },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure virtual id getter
categorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default mongoose.model('Category', categorySchema); 