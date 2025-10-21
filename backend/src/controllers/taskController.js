// Task CRUD controllers
const Task = require('../models/Task');

// GET all tasks (with optional query params for future filters, but frontend handles most)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [['order', 'ASC'], ['created_at', 'ASC']] // Default sort by order then creation
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// POST create task
const createTask = async (req, res) => {
  try {
    const { text, priority, category } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const newTask = await Task.create({
      text: text.trim(),
      priority: priority || 'medium',
      category: category && category.trim() ? category.trim() : null
    });

    // Auto-assign order as last position
    const maxOrder = await Task.max('order') || 0;
    newTask.order = maxOrder + 1;
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// PUT update task by ID (partial updates for toggle/edit)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate text if provided
    if (updates.text && (!updates.text || updates.text.trim().length === 0)) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    await task.update({
      ...updates,
      text: updates.text ? updates.text.trim() : task.text,
      category: updates.category && updates.category.trim() ? updates.category.trim() : task.category
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

// DELETE task by ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// PUT reorder tasks (accepts array of IDs to set new order)
const reorderTasks = async (req, res) => {
  try {
    const { order } = req.body; // e.g., [id3, id1, id2]
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: 'Order must be a non-empty array of IDs' });
    }

    // Validate all IDs exist
    const tasks = await Task.findAll({ where: { id: order } });
    if (tasks.length !== order.length) {
      return res.status(400).json({ error: 'Some task IDs invalid' });
    }

    // Update orders transactionally
    await Task.update(
      { order: order.indexOf(id) }, // 0-based index
      { where: { id: order } }
    );

    res.status(200).json({ message: 'Tasks reordered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
};