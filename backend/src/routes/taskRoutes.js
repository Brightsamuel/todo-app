// API routes for tasks
const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} = require('../controllers/taskController');

router.get('/', getAllTasks);

router.post('/', createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

router.put('/reorder', reorderTasks);

module.exports = router;