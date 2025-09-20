const { ethers } = require('ethers');
require('dotenv').config();

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.workEscrowContract = null;
    this.usdcContract = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Configurar provider
      this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      
      // Configurar wallet
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      
      // ABI del contrato WorkEscrow (simplificado para las funciones que necesitamos)
      const workEscrowABI = [
        "function createWork(address _worker, uint256 _amount, string calldata _title, string calldata _description, uint256 _deadline) external returns (uint256)",
        "function getWork(uint256 _workId) external view returns (tuple(uint256 id, address client, address worker, uint256 amount, string title, string description, uint8 status, uint256 createdAt, uint256 deadline, string deliveryData))",
        "function acceptWork(uint256 _workId) external",
        "function submitWork(uint256 _workId, string calldata _deliveryData) external",
        "function approveWork(uint256 _workId) external",
        "function cancelWork(uint256 _workId) external",
        "function getNextWorkId() external view returns (uint256)",
        "event WorkCreated(uint256 indexed workId, address indexed client, address indexed worker, uint256 amount, string title)"
      ];

      // ABI del contrato USDC (simplificado)
      const usdcABI = [
        "function balanceOf(address account) external view returns (uint256)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address to, uint256 amount) external returns (bool)",
        "function transferFrom(address from, address to, uint256 amount) external returns (bool)"
      ];

      // Crear instancias de contratos
      this.workEscrowContract = new ethers.Contract(
        process.env.WORK_ESCROW_CONTRACT_ADDRESS,
        workEscrowABI,
        this.wallet
      );

      this.usdcContract = new ethers.Contract(
        process.env.USDC_TOKEN_ADDRESS,
        usdcABI,
        this.wallet
      );

      this.initialized = true;
      console.log('✅ BlockchainService inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando BlockchainService:', error);
      throw error;
    }
  }

  async createWork(workData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const {
        workerAddress,
        amount,
        title,
        description,
        deadline
      } = workData;

      // Convertir amount a wei (USDC tiene 6 decimales)
      const amountInWei = ethers.parseUnits(amount.toString(), 6);

      // Verificar que el usuario tenga suficiente USDC
      const balance = await this.usdcContract.balanceOf(this.wallet.address);
      if (balance < amountInWei) {
        throw new Error('Saldo insuficiente de USDC');
      }

      // Verificar allowance
      const allowance = await this.usdcContract.allowance(this.wallet.address, process.env.WORK_ESCROW_CONTRACT_ADDRESS);
      if (allowance < amountInWei) {
        // Aprobar USDC para el contrato
        const approveTx = await this.usdcContract.approve(process.env.WORK_ESCROW_CONTRACT_ADDRESS, amountInWei);
        await approveTx.wait();
        console.log('✅ USDC aprobado para el contrato');
      }

      // Crear trabajo en blockchain
      const tx = await this.workEscrowContract.createWork(
        workerAddress || ethers.ZeroAddress, // Si no hay worker, usar address(0)
        amountInWei,
        title,
        description,
        deadline || 0
      );

      console.log('📝 Transacción enviada:', tx.hash);
      
      // Esperar confirmación
      const receipt = await tx.wait();
      console.log('✅ Transacción confirmada en bloque:', receipt.blockNumber);

      // Obtener el ID del trabajo desde el evento
      const workCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = this.workEscrowContract.interface.parseLog(log);
          return parsed.name === 'WorkCreated';
        } catch (e) {
          return false;
        }
      });

      let workId = null;
      if (workCreatedEvent) {
        const parsed = this.workEscrowContract.interface.parseLog(workCreatedEvent);
        workId = parsed.args.workId.toString();
      }

      return {
        success: true,
        transactionHash: tx.hash,
        workId: workId,
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error('❌ Error creando trabajo en blockchain:', error);
      throw error;
    }
  }

  async getWork(workId) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const work = await this.workEscrowContract.getWork(workId);
      
      // Convertir el struct a objeto JavaScript
      return {
        id: work.id.toString(),
        client: work.client,
        worker: work.worker,
        amount: ethers.formatUnits(work.amount, 6), // Convertir de wei a USDC
        title: work.title,
        description: work.description,
        status: work.status,
        createdAt: work.createdAt.toString(),
        deadline: work.deadline.toString(),
        deliveryData: work.deliveryData
      };
    } catch (error) {
      console.error('❌ Error obteniendo trabajo desde blockchain:', error);
      throw error;
    }
  }

  async acceptWork(workId) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const tx = await this.workEscrowContract.acceptWork(workId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error aceptando trabajo:', error);
      throw error;
    }
  }

  async submitWork(workId, deliveryData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const tx = await this.workEscrowContract.submitWork(workId, deliveryData);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error entregando trabajo:', error);
      throw error;
    }
  }

  async approveWork(workId) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const tx = await this.workEscrowContract.approveWork(workId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error aprobando trabajo:', error);
      throw error;
    }
  }

  async cancelWork(workId) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const tx = await this.workEscrowContract.cancelWork(workId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error cancelando trabajo:', error);
      throw error;
    }
  }

  async getUSDCBalance(address) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const balance = await this.usdcContract.balanceOf(address);
      return ethers.formatUnits(balance, 6);
    } catch (error) {
      console.error('❌ Error obteniendo balance USDC:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();
