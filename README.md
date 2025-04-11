
# Secure Walk - Security Walkways Application

![Secure Walk](public/og-image.png)

A comprehensive application for security personnel to efficiently track and monitor security walks throughout facilities.

## 📋 Features

- **QR Code Scanning:** Verify checkpoints with built-in scanner
- **User & Admin Dashboards:** Different permission levels for team management
- **Walk History:** Detailed tracking and reporting
- **Automated Theming:** Time-based dark/light mode switching
- **Responsive Design:** Works on mobile and desktop devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   cd secure-walkways
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Set up environment variables
   ```sh
   cp .env.example .env
   ```

4. For local development, ensure your `.env` file contains:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   NODE_ENV=development
   PORT=3000
   ```

## 🏃‍♂️ Running Locally

### Development Mode (Frontend + Backend)

Run both the frontend and backend concurrently:

```sh
npm run dev
```

This starts:
- Backend server at `http://localhost:3000`
- Frontend development server at `http://localhost:8080`

### Production Mode

For a production-ready build:

```sh
npm run build
npm start
```

This builds the frontend and serves both frontend and backend from the same server at `http://localhost:3000`

## 🧪 Testing the Application

### Default Test Users

The application includes two default users for testing:

- **Admin User**
  - Username: `admin`
  - Password: `admin`

- **Regular User**
  - Username: `user`
  - Password: `user`

### Testing the QR Scanner

1. Log in using any of the default users
2. Navigate to the QR Scan page 
3. Click "Scan QR Code" to activate the camera
4. Test with these valid checkpoint IDs:
   - `cp1` (Main Entrance)
   - `cp2` (East Wing)
   - `cp3` (North Gate)
5. You can also generate your own QR codes with these values to test scanning

## 📱 Platform-Specific Guides

<details>
<summary><b>MacOS (Intel and Apple Silicon)</b></summary>

1. **Install Node.js**
   ```sh
   # Using Homebrew (recommended)
   brew install node
   ```

2. Follow the standard installation steps above

#### Troubleshooting Mac Installation

- **Permission Issues**: Use `sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`
- **M1/M2 Compatibility**: If needed, use Rosetta: `arch -x86_64 zsh` then reinstall Node.js
- **Missing XCode Tools**: Run `xcode-select --install`
- **Port in Use**: Check with `lsof -i :3000` and modify port in `.env` if needed
</details>

<details>
<summary><b>Linux Deployment</b></summary>

1. **Install Node.js** (choose your distribution)
   ```sh
   # Debian/Ubuntu
   sudo apt update && sudo apt install nodejs npm
   
   # RHEL/Fedora
   sudo dnf install nodejs npm
   
   # Arch Linux
   sudo pacman -S nodejs npm
   ```

2. Follow the standard installation steps above

#### Running as systemd Service

1. Create a service file:
   ```sh
   sudo nano /etc/systemd/system/securewalk.service
   ```

2. Add configuration:
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

3. Enable and start:
   ```sh
   sudo systemctl enable securewalk
   sudo systemctl start securewalk
   ```

#### Troubleshooting Linux Installation

- **Firewall**: Run `sudo ufw allow 3000/tcp` to allow traffic
- **Port in Use**: Check with `netstat -tulpn | grep 3000`
</details>

<details>
<summary><b>Android with Termux</b></summary>

1. **Set up Termux**
   ```sh
   pkg update && pkg upgrade
   pkg install nodejs git openssh
   ```

2. Follow the standard installation steps above
3. Access the application through your Android browser at the network URL displayed when starting the server

#### Troubleshooting Termux Installation

- **Storage Access**: Run `termux-setup-storage` if needed
- **Low Resources**: Use `NODE_OPTIONS="--max-old-space-size=512"` to reduce memory usage
</details>

## 🔒 Security Considerations

- Current implementation uses in-memory storage (not persistent)
- JWT authentication is used but should be enhanced with proper key management
- The JWT secret should be stored in environment variables
- Input validation should be improved, especially for API routes
- HTTPS should be implemented for production deployments
- Consider implementing rate limiting for login attempts

## 🌐 WhatsApp Integration

<details>
<summary><b>Setting Up WhatsApp Business Integration</b></summary>

1. Register at [WhatsApp Business Platform](https://business.whatsapp.com/)
2. Configure your webhook to point to `/api/whatsapp/webhook`
3. Add the WhatsApp API token to your environment variables
4. Use commands like `/start`, `/scan`, `/history`, and `/complete`
</details>

## 🛠️ Technologies Used

- Vite
- TypeScript
- React
- Express
- JWT Authentication
- shadcn-ui
- Tailwind CSS
- React Router
- Framer Motion

## 📦 Deployment

### Production Build

1. Build the frontend:
   ```sh
   npm run build
   ```

2. Start the server:
   ```sh
   npm start
   ```

3. The application will be available at the configured port (default: 3000)

## 📄 License

[Insert your license information here]

