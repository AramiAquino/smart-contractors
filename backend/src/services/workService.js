const workRepository = require('../repositories/workRepository');

const createWork = async (workData) => {
  try {
    // Validaciones
    if (!workData.clientId) {
      throw new Error('Client ID is required');
    }
    if (!workData.amount || workData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!workData.title || workData.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!workData.description || workData.description.trim() === '') {
      throw new Error('Description is required');
    }

    // Validar deadline si se proporciona
    if (workData.deadline && workData.deadline < Date.now() / 1000) {
      throw new Error('Deadline must be in the future');
    }

    console.log('🚀 Creando trabajo...');

    // Guardar en base de datos local
    const dbWorkData = {
      clientId: workData.clientId,
      workerId: workData.workerId || null,
      amount: workData.amount,
      title: workData.title,
      description: workData.description,
      statusId: 0, // 0 = Created
      createdAt: Math.floor(Date.now() / 1000), // Timestamp actual
      deadline: workData.deadline || null,
      deliveryData: null
    };

    return new Promise((resolve, reject) => {
      workRepository.createWork(dbWorkData, (err, work) => {
        if (err) {
          console.error('❌ Error guardando trabajo en BD:', err);
          reject(err);
        } else {
          console.log('✅ Trabajo guardado en base de datos:', work.id);
          resolve(work);
        }
      });
    });

  } catch (error) {
    console.error('❌ Error en createWork service:', error);
    throw error;
  }
};

const getWork = (workId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorkById(workId, (err, work) => {
      if (err) return reject(err);
      if (!work) return reject(new Error('Work not found'));
      resolve(work);
    });
  });
};

const getWorkByBlockchainId = (blockchainWorkId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorkByBlockchainId(blockchainWorkId, (err, work) => {
      if (err) return reject(err);
      if (!work) return reject(new Error('Work not found'));
      resolve(work);
    });
  });
};

const getAllWorks = () => {
  return new Promise((resolve, reject) => {
    workRepository.getAllWorks((err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const getWorksByClient = (clientId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByClient(clientId, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const getWorksByWorker = (workerId) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByWorker(workerId, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const acceptWork = async (workId, workerId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 0) { // 0 = Created
      throw new Error('Work is not in Created status');
    }

    if (work.workerId && work.workerId !== workerId) {
      throw new Error('Work is assigned to another worker');
    }

    console.log('🚀 Aceptando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        workerId: workerId,
        statusId: 1 // 1 = InProgress
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en acceptWork service:', error);
    throw error;
  }
};

const submitWork = async (workId, deliveryData, workerId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 1) { // 1 = InProgress
      throw new Error('Work is not in InProgress status');
    }

    if (work.workerId !== workerId) {
      throw new Error('Only assigned worker can submit work');
    }

    if (!deliveryData || deliveryData.trim() === '') {
      throw new Error('Delivery data is required');
    }

    console.log('🚀 Entregando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 2, // 2 = Submitted
        deliveryData: deliveryData
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en submitWork service:', error);
    throw error;
  }
};

const approveWork = async (workId, clientId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.statusId !== 2) { // 2 = Submitted
      throw new Error('Work is not in Submitted status');
    }

    if (work.clientId !== clientId) {
      throw new Error('Only client can approve work');
    }

    console.log('🚀 Aprobando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 3 // 3 = Completed
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en approveWork service:', error);
    throw error;
  }
};

const cancelWork = async (workId, clientId) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (![0, 1].includes(work.statusId)) { // 0 = Created, 1 = InProgress
      throw new Error('Work cannot be cancelled in current status');
    }

    if (work.clientId !== clientId) {
      throw new Error('Only client can cancel work');
    }

    console.log('🚀 Cancelando trabajo...');

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        statusId: 4 // 4 = Cancelled
      }, (err, updatedWork) => {
        if (err) return reject(err);
        resolve(updatedWork);
      });
    });

  } catch (error) {
    console.error('❌ Error en cancelWork service:', error);
    throw error;
  }
};

module.exports = {
  createWork,
  getWork,
  getWorkByBlockchainId,
  getAllWorks,
  getWorksByClient,
  getWorksByWorker,
  acceptWork,
  submitWork,
  approveWork,
  cancelWork
};
