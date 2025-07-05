import { 
  users, 
  portfolioItems, 
  contactSubmissions,
  type User, 
  type InsertUser,
  type PortfolioItem,
  type InsertPortfolioItem,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolioItems: Map<number, PortfolioItem>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private currentUserId: number;
  private currentPortfolioId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.portfolioItems = new Map();
    this.contactSubmissions = new Map();
    this.currentUserId = 1;
    this.currentPortfolioId = 1;
    this.currentContactId = 1;
    
    // Initialize with sample portfolio items
    this.initializePortfolioItems();
  }

  private initializePortfolioItems() {
    const sampleItems: Omit<PortfolioItem, 'id'>[] = [
      {
        title: "Brand Story Video",
        description: "Cinematic brand storytelling for luxury fashion brand",
        category: "video",
        image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
      {
        title: "Social Media Reels",
        description: "Viral-ready content for Instagram and TikTok",
        category: "video",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
      {
        title: "Brand Messaging",
        description: "Strategic content framework for B2B SaaS startup",
        category: "content",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
      {
        title: "Content Strategy",
        description: "360-degree content plan for e-commerce brand",
        category: "content",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
      {
        title: "YouTube Thumbnails",
        description: "High-CTR thumbnail designs for tech channel",
        category: "design",
        image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
      {
        title: "Social Media Graphics",
        description: "Brand-consistent visual assets for social platforms",
        category: "design",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date(),
      },
    ];

    sampleItems.forEach(item => {
      const portfolioItem: PortfolioItem = {
        id: this.currentPortfolioId++,
        ...item,
      };
      this.portfolioItems.set(portfolioItem.id, portfolioItem);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values())
      .filter(item => item.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.currentPortfolioId++;
    const item: PortfolioItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.portfolioItems.set(id, item);
    return item;
  }

  async updatePortfolioItem(id: number, updates: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const existingItem = this.portfolioItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: PortfolioItem = {
      ...existingItem,
      ...updates,
    };
    this.portfolioItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
