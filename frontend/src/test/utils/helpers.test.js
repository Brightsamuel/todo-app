import { getPriorityClass, formatDate, debounce } from '../../utils/helpers';
import { PRIORITIES } from '../../constants/config';

describe('Helpers Utilities', () => {
  describe('getPriorityClass', () => {
    it('should return correct class for HIGH priority', () => {
      expect(getPriorityClass(PRIORITIES.HIGH)).toBe('priority-high');
    });

    it('should return correct class for MEDIUM priority', () => {
      expect(getPriorityClass(PRIORITIES.MEDIUM)).toBe('priority-medium');
    });

    it('should return correct class for LOW priority', () => {
      expect(getPriorityClass(PRIORITIES.LOW)).toBe('priority-low');
    });

    it('should return empty string for invalid priority', () => {
      expect(getPriorityClass('invalid')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format date string to short locale format', () => {
      const date = new Date('2023-10-01T00:00:00Z');
      expect(formatDate(date.toISOString())).toBe('Oct 1, 2023');
    });

    it('should handle invalid date gracefully', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFunc = jest.fn();
      const debounced = debounce(mockFunc, 100);

      debounced('test');
      jest.advanceTimersByTime(50);
      expect(mockFunc).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFunc).toHaveBeenCalledWith('test');
    });

    it('should clear previous timeout on new call', () => {
      const mockFunc = jest.fn();
      const debounced = debounce(mockFunc, 100);

      debounced('first');
      debounced('second');
      jest.advanceTimersByTime(100);
      expect(mockFunc).toHaveBeenCalledWith('second');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});