class WorkStatus {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  // Método estático para obtener el nombre del estado por ID
  static getStatusName(statusId) {
    const statusMap = {
      0: 'Created',
      1: 'InProgress', 
      2: 'Submitted',
      3: 'Completed',
      4: 'Cancelled'
    };
    return statusMap[statusId] || 'Unknown';
  }

  // Método estático para obtener el ID del estado por nombre
  static getStatusId(statusName) {
    const statusMap = {
      'Created': 0,
      'InProgress': 1,
      'Submitted': 2,
      'Completed': 3,
      'Cancelled': 4
    };
    return statusMap.hasOwnProperty(statusName) ? statusMap[statusName] : null;
  }

  // Método estático para crear instancia desde la base de datos
  static fromDB(row) {
    return new WorkStatus(row.id, row.name);
  }
}

module.exports = WorkStatus;
  