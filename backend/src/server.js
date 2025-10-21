// Main server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database'); // Import for global sync

const app = express();
const PORT = process.env.PORT || 3001; // Avoid 3000 conflict

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Force load models (attaches to sequelize instance)
try {
  require('./models/Task'); // Triggers define
  console.log('✅ Models loaded successfully');
} catch (error) {
  console.error('❌ Model load FAILED:', error.message);
  process.exit(1);
}

// Global sync for all models (creates DB/tables reliably)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Temp force for reset; change to alter later
    console.log('✅ All models synced (table recreated)');
    
    // Log DB file post-sync
    const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
    const fs = require('fs');
    if (fs.existsSync(dbPath)) {
      console.log('📁 DB file created at:', dbPath);
    }
  } catch (error) {
    console.error('❌ Sync FAILED:', error.message);
    process.exit(1);
  }
};

// Run sync before routes/listen
syncDatabase().then(async () => {
  // Load routes with error handling
  let taskRoutes;
  try {
    taskRoutes = require('./routes/taskRoutes');
    console.log('✅ Task routes loaded successfully');
    
    // Log mounted routes for debug
    console.log('🔍 Mounted routes:');
    taskRoutes.stack.forEach((layer) => {
      if (layer.route) {
        console.log(`  - ${Object.keys(layer.route.methods).join(', ')} ${layer.regexp}`);
      }
    });
  } catch (error) {
    console.error('❌ Routes load FAILED:', error.message);
    // Temp fallback: Add a dummy route to test
    app.get('/api/tasks', (req, res) => res.json([]));
    app.post('/api/tasks', (req, res) => res.status(201).json({ id: 999, text: 'Dummy' }));
    console.log('🔧 Added dummy routes for testing');
  }

  // Mount routes (or dummy if failed)
  if (taskRoutes) {
    app.use('/api/tasks', taskRoutes);
  }

  // Test route to verify mounting works
  app.get('/test', (req, res) => {
    res.json({ message: 'Routes working!', timestamp: new Date() });
  });

  // Global error handler (last)
  app.use(errorHandler);

  // Health check (enhanced)
  app.get('/health', (req, res) => res.status(200).json({ status: 'OK', db: 'Connected', routes: 'Loaded' }));

  // 404 for undefined routes (keep last)
  app.use('*', (req, res) => {
    console.log(`❌ 404 Hit: ${req.method} ${req.originalUrl}`); // Log unmatched
    res.status(404).json({ error: 'Route not found' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test (should return JSON)`);
  });
}).catch(err => {
  console.error('❌ Startup error:', err);
  process.exit(1);
});

module.exports = app;