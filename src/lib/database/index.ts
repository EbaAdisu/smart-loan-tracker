// Export all database services and utilities
export { LoanService } from './loans';
export { PaymentService } from './payments';
export * from './types';

// Create singleton instances
import { LoanService } from './loans';
import { PaymentService } from './payments';

export const loanService = new LoanService();
export const paymentService = new PaymentService();
