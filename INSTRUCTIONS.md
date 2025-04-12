
# Secure Walkways Application - Building Instructions

This document provides detailed instructions for rebuilding the Secure Walkways application using Gemini. Follow these step-by-step guidelines to create a complete security walk tracking system with both frontend and backend components.

## Application Overview

Secure Walkways is a comprehensive security tracking application that allows:
- Security personnel to track their walks through facilities
- Scanning QR codes at checkpoints to verify completion
- Administrators to manage checkpoints and view reports
- Role-based access with different interfaces for users and admins

## Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Shadcn UI** - Component library
- **Tanstack Query** - Data fetching and caching
- **Framer Motion** - Animation library

### Backend
- **Express** - Web server framework
- **JWT** - JSON Web Tokens for authentication
- **Body Parser** - Request body parsing middleware
- **CORS** - Cross-Origin Resource Sharing middleware

## Project Structure

```
secure-walkways/
├── frontend/          # React frontend application
│   ├── public/        # Static assets
│   ├── src/           # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── context/   # React context providers
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   ├── pages/     # Application pages
│   │   └── main.tsx   # Entry point
│   ├── .env           # Environment variables
│   └── vite.config.ts # Vite configuration
├── backend/           # Express backend server
│   ├── server.js      # Main server file
│   └── .env           # Environment variables
├── setup.sh           # Setup script
├── setup.js           # Setup script logic
└── .env               # Root environment variables
```

## Building the Application

### 1. Project Setup

First, set up the project structure:

```bash
mkdir -p secure-walkways
cd secure-walkways
```

Ask Gemini to create the following setup files:

1. First, create the project setup scripts:
   - `setup.sh` - Shell script to run setup
   - `setup.js` - JS script with setup logic
   - `chmod-script.js` - Script to make setup.sh executable

2. Create the basic package.json:
   - Include dependencies for Express, body-parser, cors, and JWT
   - Setup scripts for development and production

### 2. Backend Development

Ask Gemini to create the Express server (server.js) with the following features:

1. **Server Setup**
   - Express app configuration
   - Middleware setup (CORS, body-parser)
   - Port configuration

2. **Authentication**
   - JWT implementation
   - Login and logout endpoints
   - Token verification middleware

3. **In-Memory Data**
   - User data structure (admin and regular users)
   - Checkpoint data structure
   - Security walks data structure

4. **API Endpoints**
   - GET /api/walks - Get all security walks
   - POST /api/start-walk - Start a new security walk
   - POST /api/complete-checkpoint - Mark a checkpoint as completed
   - POST /api/complete-walk - Complete a security walk
   - GET /api/checkpoints - Get all checkpoints
   - POST /api/add-qrcode - Add a new QR code checkpoint
   - POST /api/update-qrcode - Update a QR code checkpoint
   - DELETE /api/delete-qrcode/:id - Delete a QR code checkpoint

5. **Server Info Route**
   - GET /server-info - Display server status information
   - Show default user credentials

### 3. Frontend Development

Ask Gemini to create the frontend application structure one section at a time:

1. **Project Configuration**
   - Create vite.config.ts
   - Set up Tailwind CSS
   - Configure environment variables

2. **Core Components**
   - Layout.tsx - Main application layout
   - NavBar.tsx - Navigation bar component
   - Button.tsx - Reusable button component
   - Card.tsx - Card component for content display

3. **Authentication**
   - AuthContext.tsx - Authentication context provider
   - UserLogin.tsx and AdminLogin.tsx - Login pages
   - API integration for authentication

4. **User Interface Pages**
   - Index.tsx - Landing page with links to user and admin login
   - UserDashboard.tsx - Dashboard for security personnel
   - WalkHistory.tsx - View completed security walks
   - AdminDashboard.tsx - Dashboard for administrators
   - QRManagement.tsx - Manage QR code checkpoints

5. **Feature Components**
   - QRScanner.tsx - Component for scanning QR codes
   - NFCScanner.tsx - Component for scanning NFC tags (optional)
   - CheckpointItem.tsx - Display checkpoint information
   - QRCodeEditor.tsx - Edit and manage QR codes

6. **Utility and Helper Functions**
   - API integration functions in lib/api.ts
   - Utility functions in lib/utils.ts

### 4. Detailed Component Instructions

#### Authentication Context

```tsx
// Tell Gemini to create AuthContext.tsx with:
// - User state management
// - Login/logout functions
// - Token storage in localStorage
// - User role checking (admin vs regular user)
```

#### QR Scanner Component

```tsx
// Tell Gemini to create QRScanner.tsx with:
// - Camera access using navigator.mediaDevices
// - QR code scanning logic
// - Feedback to user during scanning
// - Error handling for camera permissions
```

#### Admin Dashboard

```tsx
// Tell Gemini to create AdminDashboard.tsx with:
// - Statistics overview of ongoing walks
// - List of active security walks
// - Management links for QR codes and users
// - Data fetching with Tanstack Query
```

#### User Dashboard

```tsx
// Tell Gemini to create UserDashboard.tsx with:
// - Active walk status
// - Start new walk button
// - Checkpoint completion progress
// - Navigation to QR scanning
```

### 5. Routing and Navigation

Ask Gemini to create the App.tsx file with React Router configuration:

```tsx
// Include routes for:
// - Landing page
// - User and admin login
// - User dashboard and walk functionality
// - Admin dashboard and management screens
// - QR scanning page
// - Walk history and details
```

### 6. API Integration

Instruct Gemini to create the API integration module that connects to the backend:

```tsx
// lib/api.ts should include:
// - Authentication functions (login)
// - Data fetching functions for walks and checkpoints
// - API base URL from environment variables
// - Error handling for API requests
```

### 7. Styling and UI

For the UI components, ask Gemini to:

1. Use Tailwind CSS for responsive styling
2. Implement Shadcn UI components
3. Add Framer Motion animations for smooth transitions
4. Create a consistent design system across components

### 8. Running the Application

Finally, ask Gemini to explain how to run the application:

```
// Instructions for:
// - Running the setup script
// - Starting the development server
// - Accessing the application
// - Using test credentials
```

## Testing the Application

When testing, make sure to:

1. Test the login functionality for both user and admin roles
2. Verify QR code scanning works properly
3. Check that security walks can be started and completed
4. Confirm that admins can manage QR codes
5. Test the application on both desktop and mobile devices

## Common Issues and Troubleshooting

Prepare for potential issues:

1. Camera access permissions for QR scanning
2. CORS issues when connecting frontend to backend
3. JWT token expiration and authentication state
4. Mobile device compatibility for scanning

## Extending the Application

Possible extensions to suggest to Gemini:

1. Add a database backend instead of in-memory storage
2. Implement real-time notifications using WebSockets
3. Add user management for admins
4. Create detailed reporting and analytics
5. Implement offline support for mobile devices

## Technical Details for Key Features

### QR Code Scanning

For QR code scanning, ensure Gemini includes:

```javascript
// Camera access
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'environment' }
});

// QR processing using a library like jsQR
const code = jsQR(imageData.data, imageData.width, imageData.height);
```

### JWT Authentication

For JWT handling:

```javascript
// Token generation
const token = jwt.sign({ 
  id: user.id,
  username: user.username,
  role: user.role 
}, JWT_SECRET, { expiresIn: '24h' });

// Token verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

This comprehensive guide should provide all the necessary instructions for rebuilding the Secure Walkways application using Gemini.
