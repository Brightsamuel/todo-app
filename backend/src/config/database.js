// Database configuration with Sequelize
const { Sequelize } = require('sequelize');
require('dotenv').config();
const path = require('path'); // For absolute paths
const fs = require('fs'); // For file checks

// Absolute path to backend root (not src/)
const dbPath = path.resolve(__dirname, '../../database.sqlite'); 
console.log('🔧 Target DB path:', dbPath); // Log for verification

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log, // for debugging
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    if (fs.existsSync(dbPath)) {
      console.log('📁 DB file exists at:', dbPath);
    } else {
      console.log('⚠️ DB file not yet created (will on first sync)');
    }
  } catch (error) {
    console.error('❌ Database connection FAILED:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;