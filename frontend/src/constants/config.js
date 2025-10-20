// Centralized constants to avoid magic strings
export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// export const CATEGORIES = [
//   { value: 'work', label: 'Work' },
//   { value: 'personal', label: 'Personal' },
//   { value: 'shopping', label: 'Shopping' },
//   { value: 'other', label: 'Other' }
// ];

export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const STORAGE_KEY = 'todo-tasks';
export const DEBOUNCE_DELAY = 300; // ms for search debouncing