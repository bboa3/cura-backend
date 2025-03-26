export enum PrescriptionStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPENSED = 'DISPENSED'
}

const PRESCRIPTION_STATUS_DESCRIPTIONS = new Map<PrescriptionStatus, string>([
  [PrescriptionStatus.PENDING_VALIDATION, 'Aguardando verificação'],
  [PrescriptionStatus.ACTIVE, 'Ativa'],
  [PrescriptionStatus.COMPLETED, 'Completada'],
  [PrescriptionStatus.CANCELLED, 'Cancelada'],
  [PrescriptionStatus.DISPENSED, 'Dispensada'],
]);

export const convertPrescriptionStatus = (type: PrescriptionStatus): string => {
  return PRESCRIPTION_STATUS_DESCRIPTIONS.get(type) || '';
};
