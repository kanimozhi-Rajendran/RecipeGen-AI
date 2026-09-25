/**
 * Express Server Entrypoint for Recipe Generator AI
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allows frontend on any local port (e.g. 5173, 3000)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/recipes', recipeRoutes);

// Root Healthcheck
app.get('/', (req, res) => {
  res.json({
    name: 'Recipe Generator AI API',
    version: '1.0.0',
    status: 'Running',
    demoMode: process.env.DEMO_MODE === 'true',
    endpoints: {
      generate: 'POST /api/recipes/generate',
      samples: 'GET /api/recipes/samples',
      status: 'GET /api/recipes/status'
    }
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🍳 Recipe Generator AI Backend listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🤖 DEMO_MODE: ${process.env.DEMO_MODE || 'false'}`);
  console.log(`🔑 Gemini Key Configured: ${Boolean(process.env.GEMINI_API_KEY || process.env.LLM_API_KEY)}`);
  console.log('====================================================');
});
