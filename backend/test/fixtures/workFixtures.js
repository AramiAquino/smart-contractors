// Datos de prueba para los tests de Work
const workFixtures = {
  validWork: {
    clientId: 1,
    workerId: 2,
    amount: 10000,
    title: 'Test Work Title',
    description: 'Test work description',
    statusId: 0,
    createdAt: Math.floor(Date.now() / 1000),
    deadline: Math.floor(Date.now() / 1000) + 86400, // +1 día
    deliveryData: null
  },

  workWithoutWorker: {
    clientId: 1,
    workerId: null,
    amount: 5000,
    title: 'Open Work',
    description: 'Work available for any worker',
    statusId: 0,
    createdAt: Math.floor(Date.now() / 1000),
    deadline: Math.floor(Date.now() / 1000) + 86400,
    deliveryData: null
  },

  invalidWork: {
    clientId: null,
    amount: -100,
    title: '',
    description: '',
    statusId: 0
  },

  workStates: {
    created: 0,
    inProgress: 1,
    submitted: 2,
    completed: 3,
    cancelled: 4
  },

  testUsers: {
    client: { id: 1, name: 'Alice', email: 'alice@test.com' },
    worker: { id: 2, name: 'Bob', email: 'bob@test.com' }
  }
};

module.exports = workFixtures;
