import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const createLoanSchema = z.object({
  borrowerUserId: z.string().min(1, 'Please select a borrower'),
  amount: z.number().positive('Amount must be positive'),
  reason: z.string().optional(),
  dueDate: z.string().min(1, 'Please select a due date'),
});

export const updateLoanSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  reason: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['pending', 'active', 'overdue', 'completed', 'cancelled']).optional(),
});

export const recordPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  notes: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

