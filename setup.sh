
#!/bin/bash

# Display welcome message
echo "Setting up Secure Walkways application..."

# Move temporary package.json
if [ -f "temp-package.json" ]; then
  echo "Installing dependencies..."
  npm install --prefix . --package-lock-only --silent
  echo "Dependencies installed."
fi

# Run the setup script to create project structure
echo "Running setup script to organize project structure..."
node setup.js

# Create necessary directories if they don't exist
mkdir -p public
mkdir -p frontend/public

echo "Setup complete! You can now run the application with:"
echo "npm run dev - to run both client and server in development mode"
echo "npm start - to run the server only"
echo "npm run build - to build the client for production"
