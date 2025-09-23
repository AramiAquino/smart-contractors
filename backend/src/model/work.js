const WorkStatus = require('./workStatus');

class Work {
  constructor(
    id,
    clientId,
    workerId,
    amount,
    title,
    description,
    statusId,
    createdAt,
    deadline,
    deliveryData
  ) {
    this.id = id;
    this.clientId = clientId;
    this.workerId = workerId;
    this.amount = amount; // en centavos
    this.title = title;
    this.description = description;
    this.statusId = statusId;
    this.createdAt = createdAt; // epoch
    this.deadline = deadline;   // epoch
    this.deliveryData = deliveryData;
  }

  // Método estático para crear instancia desde la base de datos
  static fromDB(row) {
    return new Work(
      row.id,
      row.client_id,
      row.worker_id,
      row.amount,
      row.title,
      row.description,
      row.status_id,
      row.created_at,
      row.deadline,
      row.delivery_data
    );
  }

  // Método para obtener el nombre del estado usando WorkStatus
  getStatusName() {
    return WorkStatus.getStatusName(this.statusId);
  }

  // Método para convertir a objeto plano para respuestas API
  toJSON() {
    return {
      id: this.id,
      clientId: this.clientId,
      workerId: this.workerId,
      amount: this.amount,
      title: this.title,
      description: this.description,
      statusId: this.statusId,
      status: this.getStatusName(),
      createdAt: this.createdAt,
      deadline: this.deadline,
      deliveryData: this.deliveryData
    };
  }
}

module.exports = Work;
