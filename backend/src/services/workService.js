const workRepository = require('../repositories/workRepository');
//const blockchainService = require('./blockchainService');

const createWork = async (workData) => {
  try {
    // Validaciones
    if (!workData.clientAddress) {
      throw new Error('Client address is required');
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

    console.log('🚀 Creando trabajo en blockchain...');
    
    // Crear trabajo en blockchain
    /*  VALIDAR CON ARAMI LA FUNCION DE CREATE WORK
    const blockchainResult = await blockchainService.createWork({
      workerAddress: workData.workerAddress || null,
      amount: workData.amount,
      title: workData.title,
      description: workData.description,
      deadline: workData.deadline || 0
    });

    if (!blockchainResult.success) {
      throw new Error('Failed to create work in blockchain');
    }
    */ 

    console.log('✅ Trabajo creado en blockchain:', blockchainResult.workId);

    // Guardar en base de datos local
    const dbWorkData = {
      clientAddress: workData.clientAddress,
      workerAddress: workData.workerAddress || null,
      amount: workData.amount,
      title: workData.title,
      description: workData.description,
      status: 'Created',
      deadline: workData.deadline || null,
      deliveryData: null,
      blockchainTxHash: blockchainResult.transactionHash,
      blockchainWorkId: blockchainResult.workId
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

const getWorksByClient = (clientAddress) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByClient(clientAddress, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const getWorksByWorker = (workerAddress) => {
  return new Promise((resolve, reject) => {
    workRepository.getWorksByWorker(workerAddress, (err, works) => {
      if (err) return reject(err);
      resolve(works);
    });
  });
};

const acceptWork = async (workId, workerAddress) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.status !== 'Created') {
      throw new Error('Work is not in Created status');
    }

    if (work.workerAddress && work.workerAddress !== workerAddress) {
      throw new Error('Work is assigned to another worker');
    }

    console.log('🚀 Aceptando trabajo en blockchain...');
    
    // Aceptar trabajo en blockchain
    /* VALIDAR CON ARAMI LA FUNCION DE ACCEPT WORK
    const blockchainResult = await blockchainService.acceptWork(work.blockchainWorkId);
    
    if (!blockchainResult.success) {
      throw new Error('Failed to accept work in blockchain');
    }
    */ 

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        worker_address: workerAddress,
        status: 'InProgress'
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

const submitWork = async (workId, deliveryData, workerAddress) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.status !== 'InProgress') {
      throw new Error('Work is not in InProgress status');
    }

    if (work.workerAddress !== workerAddress) {
      throw new Error('Only assigned worker can submit work');
    }

    if (!deliveryData || deliveryData.trim() === '') {
      throw new Error('Delivery data is required');
    }

    console.log('🚀 Entregando trabajo en blockchain...');
    
    // Entregar trabajo en blockchain
    /* VALIDAR CON ARAMI LA FUNCION OF SUBMIT WORK
    const blockchainResult = await blockchainService.submitWork(work.blockchainWorkId, deliveryData);
    
    if (!blockchainResult.success) {
      throw new Error('Failed to submit work in blockchain');
    }
    */ 

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        status: 'Submitted',
        delivery_data: deliveryData
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

const approveWork = async (workId, clientAddress) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (work.status !== 'Submitted') {
      throw new Error('Work is not in Submitted status');
    }

    if (work.clientAddress !== clientAddress) {
      throw new Error('Only client can approve work');
    }

    console.log('🚀 Aprobando trabajo en blockchain...');
    
    // Aprobar trabajo en blockchain
    /* VALIDAR CON ARAMI LA FUNCION OF SUBMIT WORK
    const blockchainResult = await blockchainService.approveWork(work.blockchainWorkId);
    
    if (!blockchainResult.success) {
      throw new Error('Failed to approve work in blockchain');
    }
    */ 

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        status: 'Completed'
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

const cancelWork = async (workId, clientAddress) => {
  try {
    // Obtener trabajo de la BD
    const work = await getWork(workId);
    
    if (!['Created', 'InProgress'].includes(work.status)) {
      throw new Error('Work cannot be cancelled in current status');
    }

    if (work.clientAddress !== clientAddress) {
      throw new Error('Only client can cancel work');
    }

    console.log('🚀 Cancelando trabajo en blockchain...');
    
    // Cancelar trabajo en blockchain
    /* VALIDAR CON ARAMI LA FUNCION OF SUBMIT WORK
    const blockchainResult = await blockchainService.cancelWork(work.blockchainWorkId);
    
    if (!blockchainResult.success) {
      throw new Error('Failed to cancel work in blockchain');
    }
    */ 

    // Actualizar en BD
    return new Promise((resolve, reject) => {
      workRepository.updateWork(workId, {
        status: 'Cancelled'
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

/* VALIDAR CON ARAMI LA FUNCION getUSDCBalance
const getUSDCBalance = async (address) => {
  try {
    return await blockchainService.getUSDCBalance(address);
  } catch (error) {
    console.error('❌ Error obteniendo balance USDC:', error);
    throw error;
  }
};
*/ 

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
  cancelWork,
  //getUSDCBalance
};
