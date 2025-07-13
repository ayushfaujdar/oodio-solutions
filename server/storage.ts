import type {
  User,
  InsertUser,
  PortfolioItem as PortfolioItemType,
  InsertPortfolioItem,
  ContactSubmission as ContactSubmissionType,
  InsertContactSubmission,
  Category as CategoryType,
  InsertCategory
} from "@shared/schema";

import PortfolioItem from '../models/PortfolioItem.js';
import Category from '../models/Category.js';
import ContactSubmission from '../models/ContactSubmission.js';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolioItems(): Promise<PortfolioItemType[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItemType[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItemType>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItemType | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  getCategories(): Promise<CategoryType[]>;
  createCategory(category: InsertCategory): Promise<CategoryType>;
  deleteCategory(id: number): Promise<boolean>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmissionType>;
  getContactSubmissions(): Promise<ContactSubmissionType[]>;
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

  async getPortfolioItems(): Promise<PortfolioItemType[]> {
    return await PortfolioItem.find().sort({ createdAt: -1 });
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItemType[]> {
    return await PortfolioItem.find({ category }).sort({ createdAt: -1 });
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItemType> {
    return await PortfolioItem.create(insertItem);
  }

  async updatePortfolioItem(id: number, updates: Partial<InsertPortfolioItem>): Promise<PortfolioItemType | undefined> {
    return await PortfolioItem.findByIdAndUpdate(id, updates, { new: true });
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    const res = await PortfolioItem.findByIdAndDelete(id);
    return !!res;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmissionType> {
    return await ContactSubmission.create(insertSubmission);
  }

  async getContactSubmissions(): Promise<ContactSubmissionType[]> {
    return await ContactSubmission.find().sort({ createdAt: -1 });
  }

  async getCategories(): Promise<CategoryType[]> {
    return await Category.find().sort({ createdAt: -1 });
  }

  async createCategory(insertCategory: InsertCategory): Promise<CategoryType> {
    return await Category.create(insertCategory);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const res = await Category.findByIdAndDelete(id);
    return !!res;
  }
}

export const storage = new MongoDBStorage();
