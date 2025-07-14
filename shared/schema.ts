import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// MongoDB types
export type MongoPortfolioItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: Date;
};

export type MongoCategory = {
  _id: string;
  name: string;
  displayName: string;
  color: string;
  createdAt: Date;
};

// PostgreSQL schema definitions (kept for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  color: text("color").notNull().default("blue"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPortfolioItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
});

export const insertCategorySchema = z.object({
  name: z.string(),
  displayName: z.string(),
  color: z.string(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

// Type aliases
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PortfolioItem = MongoPortfolioItem;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type Category = MongoCategory;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
