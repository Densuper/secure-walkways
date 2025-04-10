
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = 'secure-walkways-secret-key';

// In-memory storage (replace with a database in production)
const users = [
  { id: 'admin_1', username: 'admin', password: 'admin', role: 'admin' },
  { id: 'user_1', username: 'user', password: 'user', role: 'user' }
];

const walks = [];
const checkpoints = [
  { id: 'cp1', checkpointId: 'cp1', checkpointName: 'Main Entrance', type: 'qr' },
  { id: 'cp2', checkpointId: 'cp2', checkpointName: 'East Wing', type: 'qr' },
  { id: 'cp3', checkpointId: 'cp3', checkpointName: 'North Gate', type: 'qr' }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  // Create token
  const token = jwt.sign({ 
    id: user.id,
    username: user.username,
    role: user.role 
  }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ 
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

app.post('/api/logout', authenticateToken, (req, res) => {
  // In a real implementation, you would invalidate the token here
  res.json({ success: true });
});

// Walks routes
app.get('/api/walks', authenticateToken, (req, res) => {
  res.json(walks);
});

app.post('/api/start-walk', authenticateToken, (req, res) => {
  const walkId = `walk_${Date.now()}`;
  const newWalk = {
    id: walkId,
    userId: req.user.id,
    startTime: new Date().toISOString(),
    status: 'In Progress',
    completedCheckpoints: [],
    endTime: null
  };
  
  walks.push(newWalk);
  res.json({ success: true, walkId });
});

app.post('/api/complete-checkpoint', authenticateToken, (req, res) => {
  const { walkId, checkpointId } = req.body;
  
  const walk = walks.find(w => w.id === walkId);
  if (!walk) {
    return res.status(404).json({ success: false, error: 'Walk not found' });
  }
  
  const checkpoint = checkpoints.find(c => c.id === checkpointId);
  if (!checkpoint) {
    return res.status(404).json({ success: false, error: 'Checkpoint not found' });
  }
  
  walk.completedCheckpoints.push({
    checkpointId,
    checkpointName: checkpoint.checkpointName,
    completedAt: new Date().toISOString()
  });
  
  res.json({ success: true });
});

app.post('/api/complete-walk', authenticateToken, (req, res) => {
  const { walkId } = req.body;
  
  const walk = walks.find(w => w.id === walkId);
  if (!walk) {
    return res.status(404).json({ success: false, error: 'Walk not found' });
  }
  
  walk.status = 'Completed';
  walk.endTime = new Date().toISOString();
  
  res.json({ success: true });
});

app.get('/api/walk-details/:walkId', authenticateToken, (req, res) => {
  const { walkId } = req.params;
  
  const walk = walks.find(w => w.id === walkId);
  if (!walk) {
    return res.status(404).json({ success: false, error: 'Walk not found' });
  }
  
  res.json(walk);
});

// Checkpoint management
app.get('/api/checkpoints', authenticateToken, (req, res) => {
  res.json(checkpoints);
});

app.post('/api/add-qrcode', authenticateToken, (req, res) => {
  const { checkpointName } = req.body;
  
  if (!checkpointName) {
    return res.status(400).json({ success: false, error: 'Checkpoint name is required' });
  }
  
  const id = `cp${checkpoints.length + 1}`;
  const newCheckpoint = {
    id,
    checkpointId: id,
    checkpointName,
    type: 'qr'
  };
  
  checkpoints.push(newCheckpoint);
  res.json({ success: true, checkpoint: newCheckpoint });
});

app.post('/api/update-qrcode', authenticateToken, (req, res) => {
  const { id, newName } = req.body;
  
  const checkpoint = checkpoints.find(c => c.id === id);
  if (!checkpoint) {
    return res.status(404).json({ success: false, error: 'Checkpoint not found' });
  }
  
  checkpoint.checkpointName = newName;
  res.json({ success: true });
});

app.delete('/api/delete-qrcode/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const index = checkpoints.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Checkpoint not found' });
  }
  
  checkpoints.splice(index, 1);
  res.json({ success: true });
});

// In production, serve the Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
