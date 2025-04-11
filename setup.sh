
#!/bin/bash

# Display welcome message
echo "Setting up Secure Walkways application..."

# Move temporary package.json
if [ -f "temp-package.json" ]; then
  echo "Installing server dependencies..."
  npm install --prefix . --package-lock-only --silent
  echo "Server dependencies installed."
fi

# Create necessary directories if they don't exist
mkdir -p public

echo "Setup complete! You can now run the application with:"
echo "npm run dev - to run both client and server in development mode"
echo "npm start - to run the server only"
echo "npm run build - to build the client for production"
