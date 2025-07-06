# Oodio Solutions Portfolio Website

## Overview

This is a modern, fully-animated portfolio website for Oodio Solutions, a social media management agency. The application features a glassmorphism design with neon accents, smooth animations, and a complete content management system for portfolio items.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism and neon accent themes
- **Component Library**: Radix UI components with shadcn/ui styling
- **Animations**: Framer Motion for smooth transitions and scroll animations
- **State Management**: 
  - Zustand for local state (admin modal)
  - React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store
- **Email Service**: Nodemailer for contact form submissions
- **API Design**: RESTful API with TypeScript-first approach

### Build System
- **Bundler**: Vite for frontend development and building
- **Backend Build**: ESBuild for server-side bundling
- **Development**: TSX for TypeScript execution in development
- **Type Safety**: Shared TypeScript types between frontend and backend

## Key Components

### Frontend Components
1. **Landing Page Sections**:
   - Hero section with animated background and call-to-action
   - Services section with three-phase approach cards
   - Portfolio gallery with category filtering
   - Contact form with validation
   - Footer with social links

2. **Admin Panel**:
   - Password-protected admin modal (Ctrl+Shift+O)
   - Portfolio item management (CRUD operations)
   - Image URL-based media handling
   - Real-time portfolio updates

3. **UI Components**:
   - Custom glassmorphism cards
   - Animated buttons with hover effects
   - Responsive navigation with smooth scrolling
   - Toast notifications for user feedback

### Backend Components
1. **API Routes**:
   - `/api/portfolio` - Portfolio item management
   - `/api/contact` - Contact form submissions
   - `/api/admin` - Admin authentication

2. **Database Schema**:
   - Users table for admin authentication
   - Portfolio items with categories (video, content, design)
   - Contact submissions for lead management

3. **Storage Layer**:
   - Abstract storage interface with in-memory implementation
   - Database persistence with Drizzle ORM
   - Portfolio item categorization and filtering

## Data Flow

1. **Portfolio Management**:
   - Admin creates/updates portfolio items via admin panel
   - Data validated with Zod schemas
   - Stored in PostgreSQL via Drizzle ORM
   - Real-time updates via React Query cache invalidation

2. **Contact Form**:
   - Form validation with React Hook Form + Zod
   - Email notifications via Nodemailer
   - Submissions stored in database for follow-up

3. **Content Display**:
   - Portfolio items fetched via React Query
   - Category-based filtering on frontend
   - Smooth animations with Framer Motion
   - Responsive image handling

## External Dependencies

### Frontend Dependencies
- **UI/UX**: Radix UI primitives, Framer Motion animations
- **Forms**: React Hook Form, Zod validation
- **HTTP Client**: React Query with custom API client
- **Styling**: Tailwind CSS, class-variance-authority

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Email**: Nodemailer for SMTP integration
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for runtime type checking

### Development Dependencies
- **Build Tools**: Vite, ESBuild, TSX
- **TypeScript**: Shared types, path aliases
- **Development**: Replit integration, hot module replacement

## Deployment Strategy

### Production Build
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` script
4. **Environment**: Production mode with `NODE_ENV=production`

### Development Workflow
1. **Local Development**: `npm run dev` starts Express server with Vite middleware
2. **Database Setup**: Environment variable `DATABASE_URL` required
3. **Admin Access**: Default password "admin123" (configurable via `ADMIN_PASSWORD`)
4. **Email Config**: Gmail SMTP via `EMAIL_USER` and `EMAIL_PASS` environment variables

### Environment Configuration
- **Database**: PostgreSQL connection string required
- **Email**: SMTP credentials for contact form notifications
- **Admin**: Configurable admin password for portfolio management
- **Session**: Secure session management with PostgreSQL store

## Changelog

```
Changelog:
- July 06, 2025. Enhanced admin panel with tabbed interface for portfolio, categories, and file upload management
- July 06, 2025. Updated contact form email recipient to oodio.solutions@gmail.com
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```