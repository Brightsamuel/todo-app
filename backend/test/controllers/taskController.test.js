// test/controllers/taskController.test.js
const { getAllTasks, createTask, updateTask, deleteTask, reorderTasks } = require('../../controllers/taskController');
const Task = require('../../models/Task');
const sinon = require('sinon');
const { expect } = require('chai');

describe('Task Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllTasks', () => {
    it('should fetch and return all tasks ordered by order and created_at', async () => {
      const mockTasks = [{ id: 1, text: 'Test Task' }];
      sinon.stub(Task, 'findAll').resolves(mockTasks);

      await getAllTasks(req, res);

      expect(Task.findAll.calledWith({
        order: [['order', 'ASC'], ['created_at', 'ASC']]
      })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockTasks)).to.be.true;
    });

    it('should handle errors and return 500', async () => {
      sinon.stub(Task, 'findAll').rejects(new Error('DB Error'));

      await getAllTasks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to fetch tasks' })).to.be.true;
    });
  });

  describe('createTask', () => {
    it('should create a task with default priority and null category', async () => {
      req.body = { text: 'New Task' };
      const mockTask = { id: 1, text: 'New Task', priority: 'medium', category: null, order: 0 };
      sinon.stub(Task, 'create').resolves(mockTask);
      sinon.stub(Task, 'max').resolves(0);
      sinon.stub(mockTask, 'save').resolves();

      await createTask(req, res);

      expect(Task.create.calledWith({
        text: 'New Task',
        priority: 'medium',
        category: null
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockTask)).to.be.true;
    });

    it('should validate and reject empty text', async () => {
      req.body = { text: '' };

      await createTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Task text is required' })).to.be.true;
    });

    it('should handle creation errors and return 400', async () => {
      req.body = { text: 'New Task' };
      sinon.stub(Task, 'create').rejects(new Error('DB Error'));

      await createTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to create task' })).to.be.true;
    });
  });

  describe('updateTask', () => {
    it('should update task text and trim it', async () => {
      req.params.id = '1';
      req.body = { text: ' Updated Task ' };
      const mockTask = { id: 1, text: 'Old', update: sinon.stub().resolves() };
      sinon.stub(Task, 'findByPk').resolves(mockTask);

      await updateTask(req, res);

      expect(mockTask.update.calledWith({
        text: 'Updated Task',
        category: mockTask.category
      })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockTask)).to.be.true;
    });

    it('should reject invalid task ID', async () => {
      req.params.id = '999';
      sinon.stub(Task, 'findByPk').resolves(null);

      await updateTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Task not found' })).to.be.true;
    });

    it('should validate empty text in updates', async () => {
      req.params.id = '1';
      req.body = { text: '' };
      const mockTask = { id: 1 };
      sinon.stub(Task, 'findByPk').resolves(mockTask);

      await updateTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Task text is required' })).to.be.true;
    });

    it('should handle update errors and return 400', async () => {
      req.params.id = '1';
      req.body = { text: 'Updated' };
      sinon.stub(Task, 'findByPk').resolves({ id: 1, update: sinon.stub().rejects(new Error('DB Error')) });

      await updateTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to update task' })).to.be.true;
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task and return success', async () => {
      req.params.id = '1';
      const mockTask = { id: 1, destroy: sinon.stub().resolves() };
      sinon.stub(Task, 'findByPk').resolves(mockTask);

      await deleteTask(req, res);

      expect(mockTask.destroy.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;
    });

    it('should handle non-existent task and return 404', async () => {
      req.params.id = '999';
      sinon.stub(Task, 'findByPk').resolves(null);

      await deleteTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Task not found' })).to.be.true;
    });

    it('should handle deletion errors and return 500', async () => {
      req.params.id = '1';
      const mockTask = { id: 1, destroy: sinon.stub().rejects(new Error('DB Error')) };
      sinon.stub(Task, 'findByPk').resolves(mockTask);

      await deleteTask(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to delete task' })).to.be.true;
    });
  });

  describe('reorderTasks', () => {
    it('should reorder tasks with valid IDs', async () => {
      req.body = { order: [2, 1, 3] };
      sinon.stub(Task, 'findAll').resolves([{ id: 2 }, { id: 1 }, { id: 3 }]);
      sinon.stub(Task, 'update').resolves();

      await reorderTasks(req, res);

      expect(Task.update.calledWith({ order: sinon.match.any }, { where: { id: [2, 1, 3] } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Tasks reordered' })).to.be.true;
    });

    it('should reject invalid order array', async () => {
      req.body = { order: [] };

      await reorderTasks(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Order must be a non-empty array of IDs' })).to.be.true;
    });

    it('should reject if some IDs are invalid', async () => {
      req.body = { order: [1, 999] };
      sinon.stub(Task, 'findAll').resolves([{ id: 1 }]); // Only one found

      await reorderTasks(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Some task IDs invalid' })).to.be.true;
    });

    it('should handle reordering errors and return 500', async () => {
      req.body = { order: [1] };
      sinon.stub(Task, 'findAll').resolves([{ id: 1 }]);
      sinon.stub(Task, 'update').rejects(new Error('DB Error'));

      await reorderTasks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to reorder tasks' })).to.be.true;
    });
  });
});