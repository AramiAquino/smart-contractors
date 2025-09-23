const { createTestDb } = require('../../setup/testDb');
const workFixtures = require('../../fixtures/workFixtures');

describe('WorkRepository', () => {
  let testDb;
  let workRepository;

  beforeAll(async () => {
    // Crear base de datos de prueba
    testDb = await createTestDb();
    
    // Mock del módulo db
    jest.doMock('../../../src/db', () => testDb);
    
    // Importar workRepository después del mock
    workRepository = require('../../../src/repositories/workRepository');
  });

  afterAll((done) => {
    if (testDb) {
      testDb.close(done);
    } else {
      done();
    }
  });

  describe('createWork', () => {
    test('should create a new work successfully', (done) => {
      const workData = workFixtures.validWork;
      
      workRepository.createWork(workData, (err, work) => {
        expect(err).toBeNull();
        expect(work).toBeDefined();
        expect(work.id).toBeDefined();
        expect(work.clientId).toBe(workData.clientId);
        expect(work.workerId).toBe(workData.workerId);
        expect(work.amount).toBe(workData.amount);
        expect(work.title).toBe(workData.title);
        expect(work.description).toBe(workData.description);
        expect(work.statusId).toBe(workData.statusId);
        done();
      });
    });
  });

  describe('getWorkById', () => {
    test('should get work by ID successfully', (done) => {
      workRepository.getWorkById(1, (err, work) => {
        expect(err).toBeNull();
        expect(work).toBeDefined();
        expect(work.id).toBe(1);
        done();
      });
    });

    test('should return null for non-existent work', (done) => {
      workRepository.getWorkById(999, (err, work) => {
        expect(err).toBeNull();
        expect(work).toBeNull();
        done();
      });
    });
  });

  describe('getAllWorks', () => {
    test('should get all works successfully', (done) => {
      workRepository.getAllWorks((err, works) => {
        expect(err).toBeNull();
        expect(works).toBeDefined();
        expect(Array.isArray(works)).toBe(true);
        expect(works.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('getWorksByClient', () => {
    test('should get works by client ID successfully', (done) => {
      workRepository.getWorksByClient(1, (err, works) => {
        expect(err).toBeNull();
        expect(works).toBeDefined();
        expect(Array.isArray(works)).toBe(true);
        done();
      });
    });
  });

  describe('getWorksByWorker', () => {
    test('should get works by worker ID successfully', (done) => {
      workRepository.getWorksByWorker(2, (err, works) => {
        expect(err).toBeNull();
        expect(works).toBeDefined();
        expect(Array.isArray(works)).toBe(true);
        done();
      });
    });
  });

  describe('updateWork', () => {
    test('should update work successfully', (done) => {
      const updateData = {
        statusId: 1,
        workerId: 2
      };
      
      workRepository.updateWork(1, updateData, (err, updatedWork) => {
        expect(err).toBeNull();
        expect(updatedWork).toBeDefined();
        expect(updatedWork.statusId).toBe(1);
        expect(updatedWork.workerId).toBe(2);
        done();
      });
    });
  });

  describe('updateWorkStatus', () => {
    test('should update work status successfully', (done) => {
      workRepository.updateWorkStatus(1, 2, (err, updatedWork) => {
        expect(err).toBeNull();
        expect(updatedWork).toBeDefined();
        expect(updatedWork.statusId).toBe(2);
        done();
      });
    });
  });
});
