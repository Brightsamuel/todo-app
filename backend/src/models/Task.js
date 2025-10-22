// Task model with Sequelize (sync moved to server.js for reliability)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: { len: [1, 500] }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: { len: [0, 50] }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0 
  }
}, {
  timestamps: false, 
  tableName: 'tasks'
});

module.exports = Task;