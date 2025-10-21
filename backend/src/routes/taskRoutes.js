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

// GET /api/tasks - Fetch all
router.get('/', getAllTasks);

// POST /api/tasks - Create
router.post('/', createTask);

// PUT /api/tasks/:id - Update
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete
router.delete('/:id', deleteTask);

// PUT /api/tasks/reorder - Reorder
router.put('/reorder', reorderTasks);

module.exports = router;