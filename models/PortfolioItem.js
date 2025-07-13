import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
export default PortfolioItem; 