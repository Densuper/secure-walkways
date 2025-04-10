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

## Running on macOS (Intel and Apple Silicon)

To run this application on macOS, including M1/M2 Macs, follow these steps:

1. **Ensure you have Node.js installed**:
   ```sh
   # Using Homebrew (recommended)
   brew install node
   
   # Alternatively, download from Node.js website
   # https://nodejs.org/
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

3. **Install dependencies**:
   ```sh
   npm install
   ```

4. **Set up environment variables**:
   ```sh
   cp .env.example .env
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
   - Open your browser and navigate to `http://localhost:3000`

## Running on Linux

To run this application on any Linux distribution, follow these steps:

1. **Ensure you have Node.js installed**:
   ```sh
   # For Debian/Ubuntu-based distributions
   sudo apt update
   sudo apt install nodejs npm
   
   # For Red Hat/Fedora-based distributions
   sudo dnf install nodejs npm
   
   # For Arch Linux
   sudo pacman -S nodejs npm
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

3. **Install dependencies**:
   ```sh
   npm install
   ```

4. **Set up environment variables**:
   ```sh
   cp .env.example .env
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
   - Open your browser and navigate to `http://localhost:3000`
   - For remote access, use your server's IP address: `http://<your-server-ip>:3000`

## Running as a System Service (systemd)

To run the application as a background service on Linux systems with systemd:

1. **Create a systemd service file**:
   ```sh
   sudo nano /etc/systemd/system/securewalk.service
   ```

2. **Add the following configuration** (adjust paths as needed):
   ```
   [Unit]
   Description=Secure Walk Application
   After=network.target

   [Service]
   Type=simple
   User=<your-username>
   WorkingDirectory=/path/to/secure-walkways
   ExecStart=/usr/bin/npm start
   Restart=on-failure
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start the service**:
   ```sh
   sudo systemctl enable securewalk
   sudo systemctl start securewalk
   ```

4. **Check the service status**:
   ```sh
   sudo systemctl status securewalk
   ```

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

## Troubleshooting Linux Installation

- **Permission Denied**: If you encounter permission issues when accessing ports below 1024, try running with sudo or set up port forwarding
- **Missing Dependencies**: Some distributions might require additional packages. Use your distribution's package manager to install them
- **Firewall Issues**: Make sure your firewall allows traffic on the required port: `sudo ufw allow 3000/tcp`
- **Port Already in Use**: Use `netstat -tulpn | grep 3000` to check if the port is already in use, then either stop the existing service or change the port in your `.env` file

## Troubleshooting macOS Installation

- **Permission Denied**: If you encounter permission issues with npm or node, try using `sudo` or fix permissions with: `sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`
- **Rosetta Issues** (Intel apps on M1): If you're having compatibility issues on M1/M2 Macs, try installing Node.js using Rosetta: `arch -x86_64 zsh` then reinstall Node.js
- **XCode Command Line Tools**: Some dependencies may require XCode tools: `xcode-select --install`
- **Port Already in Use**: Use `lsof -i :3000` to check if the port is in use, then either stop the service or change the port in `.env`

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
