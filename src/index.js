require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Management API is running',
    version: '1.0.0',
    endpoints: {
      addSchool:   'POST /addSchool',
      listSchools: 'GET  /listSchools?latitude=<lat>&longitude=<lng>',
    },
  });
});

// ── API Routes ──────────────────────────────────────────────
app.use('/', routes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: err.message,
  });
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(` School Management API running on http://localhost:${PORT}`);
});

module.exports = app;
