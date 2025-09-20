class Work {
  constructor(
    id,
    clientAddress,
    workerAddress,
    amount,
    title,
    description,
    status,
    createdAt,
    deadline,
    deliveryData,
    blockchainTxHash = null,
    blockchainWorkId = null
  ) {
    this.id = id;
    this.clientAddress = clientAddress;
    this.workerAddress = workerAddress;
    this.amount = amount;
    this.title = title;
    this.description = description;
    this.status = status; // 'Created', 'InProgress', 'Submitted', 'Completed', 'Cancelled'
    this.createdAt = createdAt;
    this.deadline = deadline;
    this.deliveryData = deliveryData;
    this.blockchainTxHash = blockchainTxHash;
    this.blockchainWorkId = blockchainWorkId;
  }

  // Convertir a objeto plano para JSON
  toJSON() {
    return {
      id: this.id,
      clientAddress: this.clientAddress,
      workerAddress: this.workerAddress,
      amount: this.amount,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      deadline: this.deadline,
      deliveryData: this.deliveryData,
      blockchainTxHash: this.blockchainTxHash,
      blockchainWorkId: this.blockchainWorkId
    };
  }

  // Crear desde objeto de base de datos
  static fromDB(row) {
    return new Work(
      row.id,
      row.client_address,
      row.worker_address,
      row.amount,
      row.title,
      row.description,
      row.status,
      row.created_at,
      row.deadline,
      row.delivery_data,
      row.blockchain_tx_hash,
      row.blockchain_work_id
    );
  }
}

module.exports = Work;
