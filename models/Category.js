import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  color: { type: String, required: true, default: 'blue' },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', categorySchema);
export default Category; 