import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure virtual id getter
portfolioSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default mongoose.model('Portfolio', portfolioSchema); 