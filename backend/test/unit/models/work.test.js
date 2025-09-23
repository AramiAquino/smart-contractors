const Work = require('../../../src/model/work');
const WorkStatus = require('../../../src/model/workStatus');

describe('Work Model', () => {
  let work;

  beforeEach(() => {
    work = new Work(
      1,           // id
      1,           // clientId
      2,           // workerId
      10000,       // amount
      'Test Work', // title
      'Description', // description
      0,           // statusId
      1234567890,  // createdAt
      1234567890,  // deadline
      null         // deliveryData
    );
  });

  describe('Constructor', () => {
    test('should create a work instance with correct properties', () => {
      expect(work.id).toBe(1);
      expect(work.clientId).toBe(1);
      expect(work.workerId).toBe(2);
      expect(work.amount).toBe(10000);
      expect(work.title).toBe('Test Work');
      expect(work.description).toBe('Description');
      expect(work.statusId).toBe(0);
      expect(work.createdAt).toBe(1234567890);
      expect(work.deadline).toBe(1234567890);
      expect(work.deliveryData).toBeNull();
    });
  });

  describe('fromDB', () => {
    test('should create work instance from database row', () => {
      const dbRow = {
        id: 1,
        client_id: 1,
        worker_id: 2,
        amount: 10000,
        title: 'Test Work',
        description: 'Description',
        status_id: 0,
        created_at: 1234567890,
        deadline: 1234567890,
        delivery_data: null
      };

      const workFromDB = Work.fromDB(dbRow);
      
      expect(workFromDB.id).toBe(1);
      expect(workFromDB.clientId).toBe(1);
      expect(workFromDB.workerId).toBe(2);
      expect(workFromDB.amount).toBe(10000);
      expect(workFromDB.title).toBe('Test Work');
      expect(workFromDB.description).toBe('Description');
      expect(workFromDB.statusId).toBe(0);
      expect(workFromDB.createdAt).toBe(1234567890);
      expect(workFromDB.deadline).toBe(1234567890);
      expect(workFromDB.deliveryData).toBeNull();
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
        work.statusId = statusId;
        expect(work.getStatusName()).toBe(expectedStatus);
      });
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const json = work.toJSON();
      
      expect(json).toEqual({
        id: 1,
        clientId: 1,
        workerId: 2,
        amount: 10000,
        title: 'Test Work',
        description: 'Description',
        statusId: 0,
        status: 'Created',
        createdAt: 1234567890,
        deadline: 1234567890,
        deliveryData: null
      });
    });
  });
});
