
// This is a helper script to update package.json scripts
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add or update scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "start": "node server.js",
  "dev:server": "node server.js",
  "dev:client": "vite",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
  "build": "tsc && vite build",
  "preview": "vite preview"
};

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Scripts updated in package.json');
