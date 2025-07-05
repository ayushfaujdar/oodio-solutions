import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioItemSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

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
