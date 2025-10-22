const chai = require('chai');
const sinon = require('sinon');

// Set test environment
process.env.NODE_ENV = 'test';

global.expect = chai.expect;
global.sinon = sinon;