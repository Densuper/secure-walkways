
# Secure Walkways - Frontend

This is the frontend application for the Secure Walkways security tracking system.

## Technology Stack

- **React**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Shadcn UI**: Component library
- **Tanstack Query**: Data fetching and caching

## Quick Start

1. Install dependencies
   ```sh
   npm install
   ```

2. Set up environment variables
   - The setup process creates a default `.env` file
   - Review and update values as needed, especially `VITE_API_BASE_URL`

3. Start the development server
   ```sh
   npm run dev
   ```

4. Build for production
   ```sh
   npm run build
   ```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## User Interface

### Authentication

- **Login Screen**: Enter credentials to access the application
- **Role-based Access**: Different interfaces for admin and regular users

### Admin Features

- **Dashboard**: Overview of active walks and system status
- **QR Code Management**: Create, update, and delete checkpoint QR codes
- **User Management**: Add, edit, and deactivate user accounts
- **Reports**: View walk history, completion rates, and security metrics

### User Features

- **Walk Dashboard**: View assigned security walks
- **QR Scanner**: Scan checkpoint QR codes to mark completion
- **Walk History**: View personal walk history and statistics

## Mobile Features

The application is designed as a Progressive Web App (PWA) with features optimized for mobile use:

- **Responsive UI**: Adapts to different screen sizes
- **Camera Access**: Uses device camera for QR code scanning
- **Offline Support**: Limited functionality when network is unavailable
- **Install to Home Screen**: Can be installed as a standalone app

## Customization

- **Theme**: Update the theme in `tailwind.config.ts`
- **Components**: Reusable UI components in `src/components/ui`
- **Layout**: Main application layout in `src/components/Layout.tsx`
