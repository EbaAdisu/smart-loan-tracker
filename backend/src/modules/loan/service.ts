import { LoanRepository } from "./repository";
import { Loan, LoanStatus, Payment } from "./model";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../core/errors";
import { randomUUID } from "crypto";

export class LoanService {
    static async createLoan(lenderId: string, borrowerId: string, amount: number, currency: string, reason?: string, dueDate?: string): Promise<Loan> {
        const now = new Date().toISOString();
        const loan: Loan = {
            id: randomUUID(),
            lenderId,
            borrowerId,
            amount,
            currency,
            reason,
            status: LoanStatus.PENDING,
            balanceRemaining: amount,
            dueDate,
            createdAt: now,
            updatedAt: now,
        };

        return LoanRepository.create(loan);
    }

    static async getLoan(id: string, userId: string): Promise<Loan> {
        const loan = await LoanRepository.findById(id);
        if (!loan) {
            throw new NotFoundError("Loan not found");
        }

        if (loan.lenderId !== userId && loan.borrowerId !== userId) {
            throw new ForbiddenError("Unauthorized access to loan");
        }

        return loan;
    }

    static async getUserLoans(userId: string, role?: "lender" | "borrower"): Promise<Loan[]> {
        return LoanRepository.findByUser(userId, role);
    }

    static async updateStatus(id: string, userId: string, status: string): Promise<void> {
        const loan = await this.getLoan(id, userId);

        // Simple state machine validation
        if (loan.status === LoanStatus.COMPLETED || loan.status === LoanStatus.CANCELLED) {
            throw new BadRequestError("Cannot update status of a finalized loan");
        }

        // Only borrower can accept a pending loan
        if (loan.status === LoanStatus.PENDING && status === LoanStatus.ACTIVE) {
            if (userId !== loan.borrowerId) {
                throw new ForbiddenError("Only borrower can accept the loan");
            }
        }

        // Only lender can cancel (if pending) or mark completed (manual override)
        if (status === LoanStatus.CANCELLED) {
            if (userId !== loan.lenderId && loan.status === LoanStatus.PENDING) {
                // Borrower can decline (cancel) if pending
            } else if (userId !== loan.lenderId) {
                throw new ForbiddenError("Only lender can cancel active loans");
            }
        }

        await LoanRepository.update(id, { status });
    }

    static async addPayment(loanId: string, userId: string, amount: number, note?: string, date?: string): Promise<Payment> {
        const loan = await this.getLoan(loanId, userId);

        if (loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.OVERDUE) {
            throw new BadRequestError("Loan is not active");
        }

        const payment: Payment = {
            id: randomUUID(),
            loanId,
            amount,
            date: date || new Date().toISOString(),
            note,
            recordedBy: userId,
        };

        await LoanRepository.addPayment(payment);

        // Update loan balance
        const newBalance = loan.balanceRemaining - amount;
        const updates: Partial<Loan> = { balanceRemaining: newBalance };

        if (newBalance <= 0) {
            updates.status = LoanStatus.COMPLETED;
            updates.balanceRemaining = 0; // Prevent negative
        }

        await LoanRepository.update(loanId, updates);

        return payment;
    }

    static async getLoanPayments(loanId: string, userId: string): Promise<Payment[]> {
        await this.getLoan(loanId, userId); // Ensure access rights
        return LoanRepository.getPaymentsByLoanId(loanId);
    }
}
