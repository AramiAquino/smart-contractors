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

const getWorksByClient = (clientAddress, callback) => {
  db.all("SELECT * FROM works WHERE client_address = ? ORDER BY created_at DESC", [clientAddress], (err, rows) => {
    if (err) return callback(err);
    const works = rows.map(row => Work.fromDB(row));
    callback(null, works);
  });
};

const getWorksByWorker = (workerAddress, callback) => {
  db.all("SELECT * FROM works WHERE worker_address = ? ORDER BY created_at DESC", [workerAddress], (err, rows) => {
    if (err) return callback(err);
    const works = rows.map(row => Work.fromDB(row));
    callback(null, works);
  });
};

const createWork = (workData, callback) => {
  const {
    clientAddress,
    workerAddress,
    amount,
    title,
    description,
    status,
    deadline,
    deliveryData,
    blockchainTxHash,
    blockchainWorkId
  } = workData;

  const sql = `
    INSERT INTO works (
      client_address, worker_address, amount, title, description, 
      status, deadline, delivery_data, blockchain_tx_hash, blockchain_work_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    clientAddress,
    workerAddress,
    amount,
    title,
    description,
    status,
    deadline,
    deliveryData,
    blockchainTxHash,
    blockchainWorkId
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

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = ?`);
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

const updateWorkStatus = (id, status, callback) => {
  db.run("UPDATE works SET status = ? WHERE id = ?", [status, id], function(err) {
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
