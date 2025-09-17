// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorkEscrow is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Enum para el estado de los trabajos
    enum WorkStatus {
        Created,     // 0 - Trabajo creado, esperando worker
        InProgress,  // 1 - Worker asignado, trabajo en progreso
        Submitted,   // 2 - Worker completó entrega
        Completed,   // 3 - Cliente aprobó y pagó
        Cancelled    // 4 - Trabajo cancelado
    }

    // Struct para representar un trabajo
    struct Work {
        uint256 id;
        address client;
        address worker;
        uint256 amount;
        string title;
        string description;
        WorkStatus status;
        uint256 createdAt;
        uint256 deadline;
        string deliveryData; // Para almacenar info de entrega (IPFS hash, etc.)
    }

    // Token USDC (testnet)
    IERC20 public immutable usdcToken;

    // Contador para IDs únicos
    uint256 private nextWorkId = 1;

    // Mapping de trabajos
    mapping(uint256 => Work) public works;

    // Eventos
    event WorkCreated(
        uint256 indexed workId, 
        address indexed client, 
        address indexed worker, 
        uint256 amount,
        string title
    );
    
    event WorkAccepted(uint256 indexed workId, address indexed worker);
    
    event WorkSubmitted(uint256 indexed workId, string deliveryData);
    
    event WorkApproved(
        uint256 indexed workId, 
        address indexed client, 
        address indexed worker, 
        uint256 amount
    );
    
    event WorkCancelled(uint256 indexed workId, address indexed client);

    // Modifiers
    modifier onlyClient(uint256 _workId) {
        require(works[_workId].client == msg.sender, "Only client can perform this action");
        _;
    }

    modifier onlyWorker(uint256 _workId) {
        require(works[_workId].worker == msg.sender, "Only assigned worker can perform this action");
        _;
    }

    modifier inStatus(uint256 _workId, WorkStatus _status) {
        require(works[_workId].status == _status, "Work not in required status");
        _;
    }

    modifier workExists(uint256 _workId) {
        require(works[_workId].id != 0, "Work does not exist");
        _;
    }

    constructor(address _usdcToken) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Crear un nuevo trabajo con depósito en escrow
     * @param _worker Dirección del trabajador asignado (0x0 si abierto)
     * @param _amount Cantidad de USDC a depositar
     * @param _title Título del trabajo
     * @param _description Descripción del trabajo
     * @param _deadline Timestamp límite para completar (0 si no hay)
     */
    function createWork(
        address _worker,
        uint256 _amount,
        string calldata _title,
        string calldata _description,
        uint256 _deadline
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_deadline == 0 || _deadline > block.timestamp, "Invalid deadline");

        uint256 workId = nextWorkId++;

        // Transferir USDC al contrato como escrow
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);

        works[workId] = Work({
            id: workId,
            client: msg.sender,
            worker: _worker,
            amount: _amount,
            title: _title,
            description: _description,
            status: WorkStatus.Created,
            createdAt: block.timestamp,
            deadline: _deadline,
            deliveryData: ""
        });

        emit WorkCreated(workId, msg.sender, _worker, _amount, _title);
        
        return workId;
    }

    /**
     * @dev Aceptar un trabajo (solo si worker está asignado o trabajo abierto)
     * @param _workId ID del trabajo
     */
    function acceptWork(uint256 _workId) 
        external 
        workExists(_workId) 
        inStatus(_workId, WorkStatus.Created) 
        whenNotPaused 
    {
        Work storage work = works[_workId];
        
        // Si el trabajo tiene worker asignado, solo ese worker puede aceptar
        if (work.worker != address(0)) {
            require(work.worker == msg.sender, "Not the assigned worker");
        } else {
            // Si es trabajo abierto, asignar al que acepta
            work.worker = msg.sender;
        }

        require(work.client != msg.sender, "Client cannot be the worker");
        
        work.status = WorkStatus.InProgress;
        
        emit WorkAccepted(_workId, msg.sender);
    }

    /**
     * @dev Entregar trabajo completado
     * @param _workId ID del trabajo
     * @param _deliveryData Datos de entrega (hash IPFS, URL, etc.)
     */
    function submitWork(uint256 _workId, string calldata _deliveryData) 
        external 
        workExists(_workId) 
        onlyWorker(_workId) 
        inStatus(_workId, WorkStatus.InProgress) 
        whenNotPaused 
    {
        require(bytes(_deliveryData).length > 0, "Delivery data cannot be empty");
        
        Work storage work = works[_workId];
        work.status = WorkStatus.Submitted;
        work.deliveryData = _deliveryData;
        
        emit WorkSubmitted(_workId, _deliveryData);
    }

    /**
     * @dev Aprobar trabajo y liberar pago al worker
     * @param _workId ID del trabajo
     */
    function approveWork(uint256 _workId) 
        external 
        workExists(_workId) 
        onlyClient(_workId) 
        inStatus(_workId, WorkStatus.Submitted) 
        nonReentrant 
        whenNotPaused 
    {
        Work storage work = works[_workId];
        work.status = WorkStatus.Completed;
        
        // Transferir USDC al worker
        usdcToken.safeTransfer(work.worker, work.amount);
        
        emit WorkApproved(_workId, work.client, work.worker, work.amount);
    }

    /**
     * @dev Cancelar trabajo (solo cliente, solo si Created o InProgress)
     * @param _workId ID del trabajo
     */
    function cancelWork(uint256 _workId) 
        external 
        workExists(_workId) 
        onlyClient(_workId) 
        nonReentrant 
        whenNotPaused 
    {
        Work storage work = works[_workId];
        require(
            work.status == WorkStatus.Created || work.status == WorkStatus.InProgress, 
            "Cannot cancel work in current status"
        );
        
        work.status = WorkStatus.Cancelled;
        
        // Devolver USDC al cliente
        usdcToken.safeTransfer(work.client, work.amount);
        
        emit WorkCancelled(_workId, work.client);
    }

    /**
     * @dev Obtener detalles de un trabajo
     * @param _workId ID del trabajo
     */
    function getWork(uint256 _workId) external view returns (Work memory) {
        require(works[_workId].id != 0, "Work does not exist");
        return works[_workId];
    }

    /**
     * @dev Obtener el próximo ID de trabajo disponible
     */
    function getNextWorkId() external view returns (uint256) {
        return nextWorkId;
    }

    /**
     * @dev Funciones de emergencia para el owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Función de emergencia para recuperar tokens (solo owner)
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}
