const express = require('express');
const router = express.Router();
const workService = require('../services/workService');

// Middleware para validar dirección de wallet
const validateAddress = (req, res, next) => {
  const { clientAddress, workerAddress } = req.body;
  
  if (clientAddress && !isValidEthereumAddress(clientAddress)) {
    return res.status(400).json({ 
      error: 'Invalid client address format' 
    });
  }
  
  if (workerAddress && !isValidEthereumAddress(workerAddress)) {
    return res.status(400).json({ 
      error: 'Invalid worker address format' 
    });
  }
  
  next();
};

// Función para validar dirección Ethereum
function isValidEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// POST /works - Crear un nuevo trabajo
router.post('/', validateAddress, async (req, res) => {
  try {
    const {
      clientAddress,
      workerAddress,
      amount,
      title,
      description,
      deadline
    } = req.body;

    // Validaciones básicas
    if (!clientAddress) {
      return res.status(400).json({ error: 'Client address is required' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }

    const work = await workService.createWork({
      clientAddress,
      workerAddress,
      amount: parseFloat(amount),
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? parseInt(deadline) : null
    });

    res.status(201).json({
      success: true,
      message: 'Work created successfully',
      data: work
    });

  } catch (error) {
    console.error('Error creating work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /works - Obtener todos los trabajos
router.get('/', async (req, res) => {
  try {
    const works = await workService.getAllWorks();
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /works/:id - Obtener trabajo por ID
router.get('/:id', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    const work = await workService.getWork(workId);
    res.json({
      success: true,
      data: work
    });
  } catch (error) {
    console.error('Error getting work:', error);
    if (error.message === 'Work not found') {
      res.status(404).json({
        success: false,
        error: 'Work not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
});

// GET /works/client/:address - Obtener trabajos por cliente
router.get('/client/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const works = await workService.getWorksByClient(address);
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works by client:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /works/worker/:address - Obtener trabajos por worker
router.get('/worker/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const works = await workService.getWorksByWorker(address);
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works by worker:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/accept - Aceptar trabajo
router.post('/:id/accept', validateAddress, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { workerAddress } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!workerAddress) {
      return res.status(400).json({ error: 'Worker address is required' });
    }

    const work = await workService.acceptWork(workId, workerAddress);
    res.json({
      success: true,
      message: 'Work accepted successfully',
      data: work
    });

  } catch (error) {
    console.error('Error accepting work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/submit - Entregar trabajo
router.post('/:id/submit', validateAddress, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { deliveryData, workerAddress } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!deliveryData) {
      return res.status(400).json({ error: 'Delivery data is required' });
    }

    if (!workerAddress) {
      return res.status(400).json({ error: 'Worker address is required' });
    }

    const work = await workService.submitWork(workId, deliveryData, workerAddress);
    res.json({
      success: true,
      message: 'Work submitted successfully',
      data: work
    });

  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/approve - Aprobar trabajo
router.post('/:id/approve', validateAddress, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientAddress } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientAddress) {
      return res.status(400).json({ error: 'Client address is required' });
    }

    const work = await workService.approveWork(workId, clientAddress);
    res.json({
      success: true,
      message: 'Work approved successfully',
      data: work
    });

  } catch (error) {
    console.error('Error approving work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/cancel - Cancelar trabajo
router.post('/:id/cancel', validateAddress, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientAddress } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientAddress) {
      return res.status(400).json({ error: 'Client address is required' });
    }

    const work = await workService.cancelWork(workId, clientAddress);
    res.json({
      success: true,
      message: 'Work cancelled successfully',
      data: work
    });

  } catch (error) {
    console.error('Error cancelling work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /balance/:address - Obtener balance USDC
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const balance = await workService.getUSDCBalance(address);
    res.json({
      success: true,
      data: {
        address,
        balance: balance,
        currency: 'USDC'
      }
    });

  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

module.exports = router;
