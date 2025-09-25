// services/workStatusService.js
const WorkStatus = require('../models/WorkStatus');

const TRANSITIONS = {
  Created: ['InProgress', 'Cancelled'],
  InProgress: ['Submitted', 'Cancelled'],
  Submitted: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: []
};

/**
 * Valida si se puede pasar de un estado actual a un siguiente estado
 * @param {WorkStatus|string} currentStatus - Instancia de WorkStatus o nombre del estado
 * @param {string} nextStatusName - Nombre del estado destino
 * @returns {boolean}
 */
const canTransitionTo = (currentStatus, nextStatusName) => {
  const statusName = currentStatus instanceof WorkStatus ? currentStatus.name : currentStatus;
  const allowed = TRANSITIONS[statusName] || [];
  return allowed.includes(nextStatusName);
};

/**
 * Aplica la transición y devuelve un nuevo WorkStatus
 * @param {WorkStatus|string} currentStatus
 * @param {string} nextStatusName
 * @returns {WorkStatus}
 */
const transitionTo = (currentStatus, nextStatusName) => {
  if (!canTransitionTo(currentStatus, nextStatusName)) {
    throw new Error(`Transición inválida de ${currentStatus.name || currentStatus} a ${nextStatusName}`);
  }
  // Aquí podrías generar un ID nuevo si querés o mantener el mismo
  return new WorkStatus(currentStatus.id, nextStatusName);
};

module.exports = {
  canTransitionTo,
  transitionTo
};
