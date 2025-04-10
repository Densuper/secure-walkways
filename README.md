# Secure Walk - Security Walkways Application

## Project Overview

Secure Walk is a mobile application designed to streamline security checkpoints management, enabling security personnel to efficiently track and monitor security walks throughout facilities.

**URL**: https://lovable.dev/projects/dabe77bd-19a3-4124-8022-a57b17acc87c

## Features

- QR code and NFC tag scanning for checkpoints verification
- User and admin dashboards with different permission levels
- Walk history tracking with detailed reports
- Time-based auto dark/light mode switching
- Responsive design for mobile and desktop use

## Running on Android with Termux

To run this application on Android using Termux, follow these steps:

1. **Install Termux** from F-Droid (recommended) or Google Play Store

2. **Set up Termux environment**:
   ```sh
   # Update and upgrade packages
   pkg update && pkg upgrade
   
   # Install required dependencies
   pkg install nodejs git openssh
   ```

3. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

4. **Install dependencies**:
   ```sh
   npm install
   ```

5. **Build the application**:
   ```sh
   npm run build
   ```

6. **Start the server**:
   ```sh
   npm start
   ```

7. **Access the application**:
   - The server will display URLs you can access
   - Open your Android browser and navigate to the displayed Network URL (typically http://192.168.x.x:3000)
   - You can also visit http://localhost:3000/server-info to see connection details

## Running Locally (Desktop)

To run this application locally, follow these steps:

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```sh
     cp .env.example .env
     ```
   - For local development, use:
     ```
     VITE_API_BASE_URL=http://localhost:3000
     ```

4. **Update scripts**:
   ```sh
   node scripts.js
   ```

5. **Development mode (Frontend + Backend)**:
   ```sh
   npm run dev
   ```
   This will start:
   - Backend server at `http://localhost:3000`
   - Frontend dev server at `http://localhost:8080`

6. **Production mode**:
   ```sh
   npm run build
   npm start
   ```
   This will build the frontend and serve both frontend and backend from the same server at `http://localhost:3000`

## Default Users

The application comes with two default users:

- **Admin**:
  - Username: `admin`
  - Password: `admin`

- **Regular User**:
  - Username: `user`
  - Password: `user`

## WhatsApp Deployment Instructions

### Setting up Secure Walk on WhatsApp

1. **Create a WhatsApp Business API account**:
   - Register at [WhatsApp Business Platform](https://business.whatsapp.com/)
   - Complete the verification process for your business

2. **Configure your webhook endpoint**:
   - Set up a webhook that points to your Secure Walk app's API endpoint
   - Configure the webhook to receive messages at `/api/whatsapp/webhook`

3. **Set up authentication**:
   - In your WhatsApp Business dashboard, generate an API token
   - Add this token to your Secure Walk backend environment variables

4. **Deploy your WhatsApp commands**:
   - Available commands:
     - `/start` - Begin a new security walk
     - `/scan [QR code]` - Register a checkpoint
     - `/history` - View recent walks
     - `/complete` - Mark the current walk as complete

5. **Testing the integration**:
   - Send a message to your WhatsApp Business number
   - Use the command `/start` to verify functionality
   - Complete a test walk to ensure data is properly recorded

### User Instructions

1. **Adding the Secure Walk bot to WhatsApp**:
   - Save the Secure Walk business number to your contacts
   - Send "Hello" or "/start" to initiate the bot

2. **Performing a security walk**:
   - Send `/start` to begin a new walk
   - At each checkpoint, send `/scan` followed by the checkpoint code or simply scan the QR code
   - The bot will confirm each checkpoint and record the time
   - Complete the walk with `/complete`

3. **Viewing walk history**:
   - Send `/history` to see your recent walks
   - Send `/details [walk ID]` to see specific checkpoint information

## Troubleshooting Termux Installation

- **Permission Denied**: If you encounter permission issues, try running `termux-setup-storage` to request storage access
- **Port Already in Use**: Use `netstat -tulpn | grep <port>` to check if the port is already in use
- **Network Access**: Ensure Termux has network access permissions
- **Low Storage**: Check available storage with `df -h`
- **Memory Issues**: Termux has limited resources, consider reducing the Node.js memory usage with `NODE_OPTIONS="--max-old-space-size=512"`

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- Express
- JWT Authentication
- shadcn-ui
- Tailwind CSS
- React Router
- Framer Motion for animations

## Deployment

To deploy this app to production:

1. Build the frontend:
   ```sh
   npm run build
   ```

2. Start the server:
   ```sh
   npm start
   ```

3. The application will be available at the configured port (default: 3000)
