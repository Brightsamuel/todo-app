// test/constants/config.test.js
// Note: Constants don't typically need tests, but we can verify exports if needed
const { PRIORITIES, FILTERS, STORAGE_KEY, DEBOUNCE_DELAY } = require('../../constants/config');
const { expect } = require('@jest/globals'); // Or chai if preferred

describe('Config Constants', () => {
  it('should export PRIORITIES object with correct values', () => {
    expect(PRIORITIES).toEqual({
      HIGH: 'high',
      MEDIUM: 'medium',
      LOW: 'low'
    });
  });

  it('should export FILTERS object with correct values', () => {
    expect(FILTERS).toEqual({
      ALL: 'all',
      ACTIVE: 'active',
      COMPLETED: 'completed'
    });
  });

  it('should export STORAGE_KEY and DEBOUNCE_DELAY', () => {
    expect(STORAGE_KEY).toBe('todo-tasks');
    expect(DEBOUNCE_DELAY).toBe(300);
  });
});