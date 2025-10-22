// test/config/database.test.js
const sequelize = require('../../src/config/database');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Database Configuration', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should authenticate successfully', async () => {
    sinon.stub(sequelize, 'authenticate').resolves();

    await expect(sequelize.authenticate()).to.not.be.rejected;
  });

  it('should handle authentication failure', async () => {
    const error = new Error('Connection failed');
    sinon.stub(sequelize, 'authenticate').rejects(error);

    await expect(sequelize.authenticate()).to.be.rejectedWith('Connection failed');
  });
});