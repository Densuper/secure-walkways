
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

## Development Instructions

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Troubleshooting WhatsApp Integration

- If messages aren't being received, verify your webhook URL is accessible and correctly configured
- Make sure the WhatsApp Business API token is valid and has the correct permissions
- Check your server logs for any webhook verification errors
- For scanning issues, ensure users have granted camera access in WhatsApp

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- Framer Motion for animations

## Deployment

To deploy this app to production, use Lovable's built-in deployment feature by clicking on Share -> Publish in the Lovable interface.
