import '@testing-library/jest-dom';
// Mock console.error to suppress hook logs
const consoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Failed to load tasks')) return; // Ignore specific errors
  consoleError.call(console, ...args);
};