require('dotenv').config();
const express = require('express');
const path = require('path');
const { getDb } = require('./database');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialize database on startup
getDb();

if (!(process.env.ADMIN_PASSWORD || '').trim()) {
  console.warn('Warning: ADMIN_PASSWORD is not set. Create a .env file from .env.example and set ADMIN_PASSWORD to log into the admin dashboard.');
}

// API routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
