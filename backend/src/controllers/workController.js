const express = require('express');
const router = express.Router();
const workService = require('../services/workService');

// POST /works - Crear un nuevo trabajo
router.post('/', async (req, res) => {
  try {
    const {
      clientId,
      workerId,
      amount,
      title,
      description,
      deadline
    } = req.body;

    // Validaciones básicas
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
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
      clientId: parseInt(clientId),
      workerId: workerId ? parseInt(workerId) : null,
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

// GET /works/client/:id - Obtener trabajos por cliente
router.get('/client/:id', async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const works = await workService.getWorksByClient(clientId);
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

// GET /works/worker/:id - Obtener trabajos por worker
router.get('/worker/:id', async (req, res) => {
  try {
    const workerId = parseInt(req.params.id);
    
    if (isNaN(workerId)) {
      return res.status(400).json({ error: 'Invalid worker ID' });
    }

    const works = await workService.getWorksByWorker(workerId);
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
router.post('/:id/accept', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { workerId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' });
    }

    const work = await workService.acceptWork(workId, parseInt(workerId));
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
router.post('/:id/submit', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { deliveryData, workerId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!deliveryData) {
      return res.status(400).json({ error: 'Delivery data is required' });
    }

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' });
    }

    const work = await workService.submitWork(workId, deliveryData, parseInt(workerId));
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
router.post('/:id/approve', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const work = await workService.approveWork(workId, parseInt(clientId));
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
router.post('/:id/cancel', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const work = await workService.cancelWork(workId, parseInt(clientId));
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

module.exports = router;
