
# Secure Walkways - Security Tracking Application

A comprehensive application for security personnel to efficiently track and monitor security walks throughout facilities.

## Project Structure

This project is organized into two main directories:

- `/frontend` - React application for the user interface
- `/backend` - Express server providing the API

## Detailed Setup Instructions

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

2. Make the setup script executable and run it
   ```sh
   node chmod-script.js
   ./setup.sh
   ```

   This will:
   - Install dependencies
   - Set up the project structure
   - Create necessary configuration files

3. Environment Variables

   The setup process creates default `.env` files in both frontend and backend directories. Review and update these files as needed for your environment.

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```sh
npm run dev
```

This starts:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:8080

### Run Components Separately

Start only the backend server:
```sh
npm run dev:server
```

Start only the frontend application:
```sh
npm run dev:client
```

### Production Build

Build the frontend for production:
```sh
npm run build
```

Start the production server (which serves the built frontend):
```sh
npm start
```

## Authentication

The application comes with pre-configured test users:

- **Admin User**
  - Username: `admin`
  - Password: `admin`
  - Access: Full administrative capabilities

- **Regular User**
  - Username: `user`
  - Password: `user`
  - Access: Security walk operations

## Key Features

- **QR Code Scanning**: Scan checkpoint QR codes with mobile devices
- **User Dashboard**: View assigned walks and track progress
- **Admin Dashboard**: Manage users, checkpoints, and view reports
- **Walk History**: Review completed security walks with timestamps
- **Mobile Responsive**: Designed for use on mobile devices during walks

## API Endpoints

The backend provides RESTful API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/logout`
- **Walks**: `/api/walks`, `/api/start-walk`, `/api/complete-walk`
- **Checkpoints**: `/api/checkpoints`, `/api/complete-checkpoint`
- **Management**: `/api/add-qrcode`, `/api/update-qrcode`, `/api/delete-qrcode`

For more detailed API documentation, see the backend README.
