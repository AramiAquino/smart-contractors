const db = require('../db');
const Work = require('../model/work');

const getAllWorks = (callback) => {
  db.all("SELECT * FROM works ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return callback(err);
    const works = rows.map(row => Work.fromDB(row));
    callback(null, works);
  });
};

const getWorkById = (id, callback) => {
  db.get("SELECT * FROM works WHERE id = ?", [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    callback(null, Work.fromDB(row));
  });
};

const getWorkByBlockchainId = (blockchainWorkId, callback) => {
  db.get("SELECT * FROM works WHERE blockchain_work_id = ?", [blockchainWorkId], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    callback(null, Work.fromDB(row));
  });
};

const getWorksByClient = (clientId, callback) => {
  db.all("SELECT * FROM works WHERE client_id = ? ORDER BY created_at DESC", [clientId], (err, rows) => {
    if (err) return callback(err);
    const works = rows.map(row => Work.fromDB(row));
    callback(null, works);
  });
};

const getWorksByWorker = (workerId, callback) => {
  db.all("SELECT * FROM works WHERE worker_id = ? ORDER BY created_at DESC", [workerId], (err, rows) => {
    if (err) return callback(err);
    const works = rows.map(row => Work.fromDB(row));
    callback(null, works);
  });
};

const createWork = (workData, callback) => {
  const {
    clientId,
    workerId,
    amount,
    title,
    description,
    statusId,
    createdAt,
    deadline,
    deliveryData
  } = workData;

  const sql = `
    INSERT INTO works (
      client_id, worker_id, amount, title, description, 
      status_id, created_at, deadline, delivery_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    clientId,
    workerId,
    amount,
    title,
    description,
    statusId,
    createdAt,
    deadline,
    deliveryData
  ];

  db.run(sql, params, function(err) {
    if (err) return callback(err);
    
    // Obtener el trabajo creado
    getWorkById(this.lastID, callback);
  });
};

const updateWork = (id, updateData, callback) => {
  const fields = [];
  const values = [];

  // Mapear campos de JavaScript a campos de base de datos
  const fieldMapping = {
    clientId: 'client_id',
    workerId: 'worker_id',
    statusId: 'status_id',
    deliveryData: 'delivery_data'
  };

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      const dbField = fieldMapping[key] || key;
      fields.push(`${dbField} = ?`);
      values.push(updateData[key]);
    }
  });

  if (fields.length === 0) {
    return callback(new Error('No fields to update'));
  }

  values.push(id);
  const sql = `UPDATE works SET ${fields.join(', ')} WHERE id = ?`;

  db.run(sql, values, function(err) {
    if (err) return callback(err);
    if (this.changes === 0) {
      return callback(new Error('Work not found'));
    }
    getWorkById(id, callback);
  });
};

const updateWorkStatus = (id, statusId, callback) => {
  db.run("UPDATE works SET status_id = ? WHERE id = ?", [statusId, id], function(err) {
    if (err) return callback(err);
    if (this.changes === 0) {
      return callback(new Error('Work not found'));
    }
    getWorkById(id, callback);
  });
};

const deleteWork = (id, callback) => {
  db.run("DELETE FROM works WHERE id = ?", [id], function(err) {
    if (err) return callback(err);
    if (this.changes === 0) {
      return callback(new Error('Work not found'));
    }
    callback(null, { deleted: true });
  });
};

module.exports = {
  getAllWorks,
  getWorkById,
  getWorkByBlockchainId,
  getWorksByClient,
  getWorksByWorker,
  createWork,
  updateWork,
  updateWorkStatus,
  deleteWork
};
