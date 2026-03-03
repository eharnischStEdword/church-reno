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

// Initialize database on startup (ensure persistent path on Render: DB_PATH=/opt/render/project/data/quiz.db)
getDb();
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'db', 'quiz.db');
console.log('Database path:', dbPath);

// Health check for keep-alive pings (e.g. UptimeRobot every 10–14 min to prevent Render spin-down)
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

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
