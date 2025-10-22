// test/middleware/errorHandler.test.js
const errorHandler = require('../../src/middleware/errorHandler');
const sinon = require('sinon');
const { expect } = require('chai');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    next = sinon.stub();
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should handle default error with 500 status', () => {
    const err = new Error('Test Error');

    errorHandler(err, req, res, next);

    expect(console.error.calledWith('Error:', err.stack)).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({
      error: 'Test Error'
    })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should use provided statusCode', () => {
    const err = { statusCode: 400, message: 'Bad Request' };

    errorHandler(err, req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({
      error: 'Bad Request'
    })).to.be.true;
  });

  it('should include stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('Dev Error');

    errorHandler(err, req, res, next);

    expect(res.json.calledWith(sinon.match({
      error: 'Dev Error',
      stack: err.stack
    }))).to.be.true;
  });

  it('should exclude stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('Prod Error');

    errorHandler(err, req, res, next);

    expect(res.json.calledWith({
      error: 'Prod Error'
    })).to.be.true;
  });
});