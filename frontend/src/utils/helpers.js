import { PRIORITIES } from '../constants/config';

// Reusable utility functions
export const getPriorityClass = (priority) => {
  switch (priority) {
    case PRIORITIES.HIGH: return 'priority-high';
    case PRIORITIES.MEDIUM: return 'priority-medium';
    case PRIORITIES.LOW: return 'priority-low';
    default: return '';
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};