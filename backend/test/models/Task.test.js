// test/models/Task.test.js
const Task = require('../../models/Task');
const sequelize = require('../../config/database');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Task Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.drop();
    sinon.restore();
  });

  after(async () => {
    await sequelize.close();
  });

  it('should create a task with valid data', async () => {
    const taskData = {
      text: 'Valid Task',
      priority: 'high',
      category: 'Work'
    };

    const task = await Task.create(taskData);

    expect(task.text).to.equal('Valid Task');
    expect(task.priority).to.equal('high');
    expect(task.category).to.equal('Work');
    expect(task.completed).to.be.false;
    expect(task.created_at).to.be.a('date');
    expect(task.order).to.equal(0);
  });

  it('should default priority to medium if not provided', async () => {
    const task = await Task.create({ text: 'Default Task' });

    expect(task.priority).to.equal('medium');
  });

  it('should allow null category', async () => {
    const task = await Task.create({ text: 'No Category', category: null });

    expect(task.category).to.be.null;
  });

  it('should validate text length (min 1)', async () => {
    await expect(Task.create({ text: '' })).to.be.rejectedWith(/Validation error/);
  });

  it('should validate text length (max 500)', async () => {
    const longText = 'a'.repeat(501);
    await expect(Task.create({ text: longText })).to.be.rejectedWith(/Validation error/);
  });

  it('should validate category length (max 50)', async () => {
    const longCategory = 'a'.repeat(51);
    await expect(Task.create({ text: 'Test', category: longCategory })).to.be.rejectedWith(/Validation error/);
  });

  it('should reject invalid priority enum', async () => {
    await expect(Task.create({ text: 'Test', priority: 'invalid' })).to.be.rejectedWith(/Validation error/);
  });

  it('should update task properties', async () => {
    const task = await Task.create({ text: 'Original' });
    await task.update({ text: 'Updated', completed: true });

    expect(task.text).to.equal('Updated');
    expect(task.completed).to.be.true;
  });
});