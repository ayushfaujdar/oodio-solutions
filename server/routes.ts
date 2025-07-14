import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioItemSchema, insertContactSubmissionSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 * 1024 * 1024 } // 10TB
});

// Admin password - in production, use proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));
  
  // File upload endpoint
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto"
      });

      const fileUrl = result.secure_url;
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as any).message : 'Unknown error';
      res.status(500).json({ message: 'Failed to upload file', error: errorMessage });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create category' });
      }
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });
  
  // Portfolio routes
  app.get('/api/portfolio', async (req, res) => {
    try {
      const category = req.query.category as string;
      const items = category 
        ? await storage.getPortfolioItemsByCategory(category)
        : await storage.getPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      res.status(500).json({ message: 'Failed to fetch portfolio items' });
    }
  });

  app.post('/api/portfolio', async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create portfolio item' });
      }
    }
  });

  app.put('/api/portfolio/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPortfolioItemSchema.partial().parse(req.body);
      const item = await storage.updatePortfolioItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update portfolio item' });
      }
    }
  });

  app.delete('/api/portfolio/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      res.status(500).json({ message: 'Failed to delete portfolio item' });
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'your-email@gmail.com',
          to: 'codeayush7@gmail.com',
          subject: `New Contact Form Submission - ${validatedData.name}`,
          text: `
            Name: ${validatedData.name}
            Email: ${validatedData.email}
            Message: ${validatedData.message}
          `,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue processing even if email fails
      }
      
      res.json({ message: 'Contact form submitted successfully' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to process contact form' });
      }
    }
  });

  // Admin authentication route
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      
      if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Admin authenticated successfully' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Error authenticating admin:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  });

  // Get contact submissions (admin only)
  app.get('/api/admin/contacts', async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ message: 'Failed to fetch contact submissions' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
