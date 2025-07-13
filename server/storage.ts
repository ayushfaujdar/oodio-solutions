import { 
  users, 
  portfolioItems, 
  contactSubmissions,
  categories,
  type User, 
  type InsertUser,
  type PortfolioItem,
  type InsertPortfolioItem,
  type ContactSubmission,
  type InsertContactSubmission,
  type Category,
  type InsertCategory
} from "@shared/schema";

const PortfolioItem = require('../models/PortfolioItem.js');
const Category = require('../models/Category.js');
const ContactSubmission = require('../models/ContactSubmission.js');

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: number): Promise<boolean>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

class MongoDBStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return undefined; // User methods are not implemented (not used in current app)
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined; // User methods are not implemented (not used in current app)
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    return undefined; // User methods are not implemented (not used in current app)
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await PortfolioItem.find().sort({ createdAt: -1 });
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await PortfolioItem.find({ category }).sort({ createdAt: -1 });
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    return await PortfolioItem.create(insertItem);
  }

  async updatePortfolioItem(id: number, updates: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    return await PortfolioItem.findByIdAndUpdate(id, updates, { new: true });
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    const res = await PortfolioItem.findByIdAndDelete(id);
    return !!res;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    return await ContactSubmission.create(insertSubmission);
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await ContactSubmission.find().sort({ createdAt: -1 });
  }

  async getCategories(): Promise<Category[]> {
    return await Category.find().sort({ createdAt: -1 });
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    return await Category.create(insertCategory);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const res = await Category.findByIdAndDelete(id);
    return !!res;
  }
}

export const storage = new MongoDBStorage();
