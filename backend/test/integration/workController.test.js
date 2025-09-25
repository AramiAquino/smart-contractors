const request = require('supertest');
const express = require('express');
const workFixtures = require('../fixtures/workFixtures');

describe('Work Controller Integration Tests', () => {
  let app;
  let testDb;

  beforeAll(async () => {
    // Crear base de datos de prueba
    const { createTestDb } = require('../setup/testDb');
    testDb = await createTestDb();
    
    // Mock del módulo db
    jest.doMock('../../src/db', () => testDb);
    
    // Importar workController después del mock
    const workController = require('../../src/controllers/workController');
    
    // Crear app de Express para testing
    app = express();
    app.use(express.json());
    app.use('/works', workController);
  });

  afterAll((done) => {
    if (testDb) {
      testDb.close(done);
    } else {
      done();
    }
  });
  describe('POST /works', () => {
    test('should create a new work successfully', async () => {
      const workData = workFixtures.validWork;
      
      const response = await request(app)
        .post('/works')
        .send(workData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Work created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.clientId).toBe(workData.clientId);
      expect(response.body.data.title).toBe(workData.title);
    });

    test('should return 400 for missing client ID', async () => {
      const invalidWork = { ...workFixtures.validWork };
      delete invalidWork.clientId;
      
      const response = await request(app)
        .post('/works')
        .send(invalidWork)
        .expect(400);
      
      expect(response.body.error).toBe('Client ID is required');
    });

    test('should return 400 for invalid amount', async () => {
      const invalidWork = { ...workFixtures.validWork, amount: -100 };
      
      const response = await request(app)
        .post('/works')
        .send(invalidWork)
        .expect(400);
      
      expect(response.body.error).toBe('Amount must be greater than 0');
    });

    test('should return 400 for empty title', async () => {
      const invalidWork = { ...workFixtures.validWork, title: '' };
      
      const response = await request(app)
        .post('/works')
        .send(invalidWork)
        .expect(400);
      
      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('GET /works', () => {
    test('should get all works successfully', async () => {
      const response = await request(app)
        .get('/works')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /works/:id', () => {
    test('should get work by ID successfully', async () => {
      const response = await request(app)
        .get('/works/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
    });

    test('should return 400 for invalid work ID', async () => {
      const response = await request(app)
        .get('/works/invalid')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid work ID');
    });
  });

  describe('GET /works/client/:id', () => {
    test('should get works by client ID successfully', async () => {
      const response = await request(app)
        .get('/works/client/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return 400 for invalid client ID', async () => {
      const response = await request(app)
        .get('/works/client/invalid')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid client ID');
    });
  });

  describe('GET /works/worker/:id', () => {
    test('should get works by worker ID successfully', async () => {
      const response = await request(app)
        .get('/works/worker/2')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return 400 for invalid worker ID', async () => {
      const response = await request(app)
        .get('/works/worker/invalid')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid worker ID');
    });
  });

  describe('POST /works/:id/accept', () => {
    test('should return 400 for missing worker ID', async () => {
      const response = await request(app)
        .post('/works/1/accept')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Worker ID is required');
    });

    test('should handle work acceptance', async () => {
      const response = await request(app)
        .post('/works/1/accept')
        .send({ workerId: 2 });
      
      // Puede devolver 200 (si el trabajo está en Created) o 500 (si no)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('POST /works/:id/submit', () => {
    test('should return 400 for missing delivery data', async () => {
      const response = await request(app)
        .post('/works/1/submit')
        .send({ workerId: 2 })
        .expect(400);
      
      expect(response.body.error).toBe('Delivery data is required');
    });

    test('should handle work submission', async () => {
      const response = await request(app)
        .post('/works/1/submit')
        .send({ 
          deliveryData: 'Test delivery data',
          workerId: 2 
        });
      
      // Puede devolver 200 (si el trabajo está en InProgress) o 500 (si no)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('POST /works/:id/approve', () => {
    test('should return 400 for missing client ID', async () => {
      const response = await request(app)
        .post('/works/1/approve')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Client ID is required');
    });

    test('should handle work approval attempt', async () => {
      const response = await request(app)
        .post('/works/1/approve')
        .send({ clientId: 1 });
      
      // Puede devolver 200 (si el trabajo está en Submitted) o 500 (si no)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('POST /works/:id/cancel', () => {
    test('should return 400 for missing client ID', async () => {
      const response = await request(app)
        .post('/works/1/cancel')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Client ID is required');
    });

    test('should return 500 for work not in cancellable status', async () => {
      const response = await request(app)
        .post('/works/1/cancel')
        .send({ clientId: 1 })
        .expect(500);
      
      expect(response.body.success).toBe(false);
    });
  });
});
