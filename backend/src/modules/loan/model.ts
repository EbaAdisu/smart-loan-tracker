import { t } from "elysia";

export const LoanStatus = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    OVERDUE: "OVERDUE",
} as const;

export type LoanStatusType = typeof LoanStatus[keyof typeof LoanStatus];

export const LoanSchema = t.Object({
    id: t.String(),
    lenderId: t.String(),
    borrowerId: t.String(),
    amount: t.Number(),
    currency: t.String({ default: "USD" }),
    reason: t.Optional(t.String()),
    status: t.String(), // Enum: PENDING, ACTIVE, COMPLETED, CANCELLED, OVERDUE
    balanceRemaining: t.Number(),
    dueDate: t.Optional(t.String({ format: "date-time" })),
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
});

export type Loan = typeof LoanSchema.static;

export const CreateLoanSchema = t.Object({
    borrowerId: t.String(), // User ID of the borrower (if creating as lender) or lender (if creating as borrower) - logic handled in service
    amount: t.Number({ minimum: 0 }),
    currency: t.Optional(t.String({ default: "USD" })),
    reason: t.Optional(t.String()),
    dueDate: t.Optional(t.String({ format: "date-time" })),
});

export const UpdateLoanStatusSchema = t.Object({
    status: t.String(), // Only specific transitions allowed
});

export const PaymentSchema = t.Object({
    id: t.String(),
    loanId: t.String(),
    amount: t.Number(),
    date: t.String({ format: "date-time" }),
    note: t.Optional(t.String()),
    recordedBy: t.String(), // User ID who recorded the payment
});

export type Payment = typeof PaymentSchema.static;

export const CreatePaymentSchema = t.Object({
    amount: t.Number({ minimum: 0 }),
    note: t.Optional(t.String()),
    date: t.Optional(t.String({ format: "date-time" })), // Defaults to now
});
