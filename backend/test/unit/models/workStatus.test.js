const WorkStatus = require('../../../src/model/workStatus');

describe('WorkStatus Model', () => {
  describe('Constructor', () => {
    test('should create a work status instance with correct properties', () => {
      const status = new WorkStatus(0, 'Created');
      
      expect(status.id).toBe(0);
      expect(status.name).toBe('Created');
    });
  });

  describe('getStatusName', () => {
    test('should return correct status name for each status ID', () => {
      const testCases = [
        { statusId: 0, expectedStatus: 'Created' },
        { statusId: 1, expectedStatus: 'InProgress' },
        { statusId: 2, expectedStatus: 'Submitted' },
        { statusId: 3, expectedStatus: 'Completed' },
        { statusId: 4, expectedStatus: 'Cancelled' },
        { statusId: 999, expectedStatus: 'Unknown' }
      ];

      testCases.forEach(({ statusId, expectedStatus }) => {
        expect(WorkStatus.getStatusName(statusId)).toBe(expectedStatus);
      });
    });
  });

  describe('getStatusId', () => {
    test('should return correct status ID for each status name', () => {
      const testCases = [
        { statusName: 'Created', expectedId: 0 },
        { statusName: 'InProgress', expectedId: 1 },
        { statusName: 'Submitted', expectedId: 2 },
        { statusName: 'Completed', expectedId: 3 },
        { statusName: 'Cancelled', expectedId: 4 },
        { statusName: 'InvalidStatus', expectedId: null }
      ];

      testCases.forEach(({ statusName, expectedId }) => {
        const result = WorkStatus.getStatusId(statusName);
        expect(result).toBe(expectedId);
      });
    });
  });

  describe('fromDB', () => {
    test('should create work status instance from database row', () => {
      const dbRow = { id: 0, name: 'Created' };
      const status = WorkStatus.fromDB(dbRow);
      
      expect(status.id).toBe(0);
      expect(status.name).toBe('Created');
    });
  });
});
