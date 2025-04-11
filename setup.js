
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

async function createDirectoryIfNotExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory ${dir} created or already exists`);
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
}

async function createBackendStructure() {
  console.log("Setting up backend structure...");
  
  // Create backend directory structure
  await createDirectoryIfNotExists('backend');
  
  // Move server.js to backend folder
  try {
    const serverContent = await fs.readFile('server.js', 'utf-8');
    await fs.writeFile('backend/server.js', serverContent);
    console.log("Moved server.js to backend folder");
  } catch (err) {
    console.error("Error moving server.js:", err);
  }
  
  // Create backend README
  await fs.writeFile('backend/README.md', 
`# Secure Walkways - Backend

This is the backend server for the Secure Walkways application.

## Quick Start

1. Install dependencies
   \`\`\`
   npm install
   \`\`\`

2. Set up environment variables
   - Copy \`.env.example\` to \`.env\`
   - Update the values as needed

3. Start the server
   \`\`\`
   npm start
   \`\`\`

## API Documentation

The server provides the following endpoints:

- \`/api/auth/login\` - User authentication
- \`/api/walks\` - Get all walks
- \`/api/start-walk\` - Start a new security walk
- \`/api/complete-checkpoint\` - Mark a checkpoint as completed
- \`/api/complete-walk\` - Complete a security walk
- \`/api/checkpoints\` - Get all checkpoints
`);

  // Create backend .env
  await fs.writeFile('backend/.env', 
`# Server Port
PORT=3000

# JWT Secret (change this in production)
JWT_SECRET=secure-walkways-secret-key

# Environment Mode
NODE_ENV=development
`);

  console.log("Backend setup completed");
}

async function createFrontendStructure() {
  console.log("Setting up frontend structure...");
  
  // Create frontend directory structure
  await createDirectoryIfNotExists('frontend');
  await createDirectoryIfNotExists('frontend/src');
  
  // Move vite config to frontend folder
  try {
    const viteConfigContent = await fs.readFile('vite.config.ts', 'utf-8');
    await fs.writeFile('frontend/vite.config.ts', viteConfigContent);
    console.log("Moved vite.config.ts to frontend folder");
  } catch (err) {
    console.error("Error moving vite.config.ts:", err);
  }
  
  // Create frontend README
  await fs.writeFile('frontend/README.md', 
`# Secure Walkways - Frontend

This is the frontend application for the Secure Walkways security tracking system.

## Quick Start

1. Install dependencies
   \`\`\`
   npm install
   \`\`\`

2. Set up environment variables
   - Copy \`.env.example\` to \`.env\`
   - Update the values as needed

3. Start the development server
   \`\`\`
   npm run dev
   \`\`\`

4. Build for production
   \`\`\`
   npm run build
   \`\`\`

## Features

- QR Code scanning for checkpoints
- Security walk tracking
- Responsive design for mobile and desktop
- Admin and user dashboards
`);

  // Create frontend .env
  await fs.writeFile('frontend/.env', 
`# API Base URL - For local development, this will match the Express server
VITE_API_BASE_URL=http://localhost:3000
`);

  console.log("Frontend setup completed");
}

async function updateRootReadme() {
  await fs.writeFile('README.md', 
`# Secure Walkways - Security Tracking Application

A comprehensive application for security personnel to efficiently track and monitor security walks throughout facilities.

## Project Structure

This project is organized into two main directories:

- \`/frontend\` - React application for the user interface
- \`/backend\` - Express server providing the API

## Quick Start

1. Install dependencies
   \`\`\`
   npm install
   \`\`\`

2. Run the setup script
   \`\`\`
   npm run setup
   \`\`\`

3. Start both frontend and backend in development mode
   \`\`\`
   npm run dev
   \`\`\`

4. Or start them separately:
   - Backend: \`npm run dev:server\`
   - Frontend: \`npm run dev:client\`

## Test Users

- **Admin User**
  - Username: \`admin\`
  - Password: \`admin\`

- **Regular User**
  - Username: \`user\`
  - Password: \`user\`

## Features

- QR Code Scanning for checkpoints
- User & Admin Dashboards
- Walk History and detailed reporting
- Responsive design for mobile and desktop
`);

  console.log("Root README updated");
}

async function main() {
  console.log("Starting project restructuring...");
  
  try {
    await createBackendStructure();
    await createFrontendStructure();
    await updateRootReadme();
    
    console.log("Project restructuring completed successfully!");
    console.log("Next steps:");
    console.log("1. Run 'npm install' to install dependencies");
    console.log("2. Run 'npm run dev' to start both frontend and backend");
  } catch (err) {
    console.error("Error during project restructuring:", err);
  }
}

main();
