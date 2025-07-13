# Creative Social Hub

A full-stack social media management platform built with React, Express, and MongoDB.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_admin_password
EMAIL_PASS=your_email_password
SESSION_SECRET=your_session_secret
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayushfaujdar/oodio-solutions.git
cd oodio-solutions
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

## Development

Run the development server:
```bash
npm run dev
```

## Deployment

1. Ensure all environment variables are set in your deployment platform
2. Build the project: `npm run build`
3. Start the server: `npm start`

## Features

- Portfolio management
- Social media integration
- Admin dashboard
- File uploads with Cloudinary
- MongoDB database integration
- Responsive design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- File Storage: Cloudinary
- Build Tools: Vite, esbuild 