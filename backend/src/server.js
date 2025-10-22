// Main server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database'); 

const app = express();
const PORT = process.env.PORT || 3001;
const IS_DEV = process.env.NODE_ENV === 'development';

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  require('./models/Task'); // Triggers defines
  if (IS_DEV) console.log('✅ Models loaded');
} catch (error) {
  console.error('❌ Model load FAILED:', error.message);
  process.exit(1);
}

// Sync DB (dev: alter; prod: false for safety)
const syncDatabase = async () => {
  try {
    const syncOpts = IS_DEV ? { alter: true } : { force: false };
    await sequelize.sync(syncOpts);
    if (IS_DEV) {
      console.log('✅ DB synced');
      const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
      const fs = require('fs');
      if (fs.existsSync(dbPath)) console.log('📁 DB at:', dbPath);
    }
  } catch (error) {
    console.error('❌ Sync FAILED:', error.message);
    process.exit(1);
  }
};

const mountRoutes = () => {
  try {
    const taskRoutes = require('./routes/taskRoutes');
    if (IS_DEV) {
      console.log('✅ Routes mounted')
      taskRoutes.stack.forEach((layer) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods).join(', ');
          const path = layer.regexp.source.replace(/^\^\\\//, '').replace(/\\\/\\?.*$/, '');
          console.log(`  - ${methods} ${path}`);
        }
      });
    }
    app.use('/api/tasks', taskRoutes);
  } catch (error) {
    console.error('❌ Routes FAILED:', error.message);
    process.exit(1); 
  }
};

app.get('/health', (req, res) => res.status(200).json({ status: 'OK', db: 'Connected' }));

app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
syncDatabase().then(mountRoutes).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server on http://localhost:${PORT}`);
    if (IS_DEV) console.log(`🧪 Health: http://localhost:${PORT}/health`);
  });
}).catch(err => {
  console.error('❌ Startup FAILED:', err);
  process.exit(1);
});

module.exports = app;