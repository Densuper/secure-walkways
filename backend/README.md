
# Secure Walkways - Backend

This is the backend server for the Secure Walkways application.

## Technology Stack

- **Express**: Web server framework
- **JWT**: JSON Web Tokens for authentication
- **Body Parser**: Request body parsing middleware
- **CORS**: Cross-Origin Resource Sharing middleware

## Quick Start

1. Install dependencies
   ```sh
   npm install
   ```

2. Set up environment variables
   - The setup process creates a default `.env` file
   - Key variables to configure:
     - `PORT`: Server port (default: 3000)
     - `JWT_SECRET`: Secret key for JWT tokens
     - `NODE_ENV`: Environment mode (development/production)

3. Start the server
   ```sh
   npm start
   ```

## Server Information

Once running, the server provides a status page at:
- `http://localhost:3000/server-info`

This page displays:
- Server status
- Access URLs (local and network)
- Default user credentials

## API Documentation

### Authentication

- **POST /api/auth/login**
  - Request: `{ username, password }`
  - Response: `{ success, token, user }`
  - Description: Authenticates a user and returns a JWT token

- **POST /api/auth/logout**
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success }`
  - Description: Logs out the current user

### Security Walks

- **GET /api/walks**
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of walk objects
  - Description: Retrieves all security walks

- **POST /api/start-walk**
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, walkId }`
  - Description: Starts a new security walk

- **POST /api/complete-checkpoint**
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ walkId, checkpointId }`
  - Response: `{ success }`
  - Description: Marks a checkpoint as completed

- **POST /api/complete-walk**
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ walkId }`
  - Response: `{ success }`
  - Description: Completes a security walk

- **GET /api/walk-details/:walkId**
  - Headers: `Authorization: Bearer <token>`
  - Response: Walk object with details
  - Description: Gets detailed information about a specific walk

### Checkpoint Management

- **GET /api/checkpoints**
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of checkpoint objects
  - Description: Retrieves all checkpoints

- **POST /api/add-qrcode**
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ checkpointName }`
  - Response: `{ success, checkpoint }`
  - Description: Adds a new QR code checkpoint

- **POST /api/update-qrcode**
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ id, newName }`
  - Response: `{ success }`
  - Description: Updates a QR code checkpoint name

- **DELETE /api/delete-qrcode/:id**
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success }`
  - Description: Deletes a QR code checkpoint

## Data Storage

For development purposes, data is stored in-memory using the following structures:

- **Users**: Array of user objects with credentials and roles
- **Walks**: Array of walk objects with checkpoints and timestamps
- **Checkpoints**: Array of checkpoint objects with IDs and names

In a production environment, replace these with a proper database implementation.

## Production Deployment

When `NODE_ENV` is set to `production`, the server also serves the frontend build from the `dist` directory.
