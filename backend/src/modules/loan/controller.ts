import { Elysia, t } from "elysia";
import { authMiddleware, type User } from "../auth/middleware";
import { LoanService } from "./service";
import { CreateLoanSchema, CreatePaymentSchema, UpdateLoanStatusSchema } from "./model";
import { UnauthorizedError } from "../../core/errors";

export const loanController = new Elysia({ prefix: "/loans" })
    .use(authMiddleware)
    .get("/", async ({ user, query }) => {
        if (!user) throw new UnauthorizedError();
        const role = query.role as "lender" | "borrower" | undefined;
        return LoanService.getUserLoans(user.uid, role);
    }, {
        isAuth: true,
        query: t.Object({
            role: t.Optional(t.String()),
        }),
    })
    .post("/", async ({ user, body }: { user: User | null, body: typeof CreateLoanSchema.static }) => {
        if (!user) throw new UnauthorizedError();
        return LoanService.createLoan(
            user.uid, // Current user is the lender by default? Or should we allow specifying?
            // For now, let's assume the creator is the lender, unless we want to support "Requesting a loan"
            // Let's stick to "I am lending money to someone" flow first as per typical use case, 
            // OR "I am borrowing" if we want.
            // Actually, let's assume the creator is the lender for now.
            // Wait, if I request a loan, I am the borrower.
            // Let's check the body. If I am the lender, body has borrowerId.
            // If I am the borrower, body has lenderId?
            // The CreateLoanSchema has borrowerId. So let's assume the creator is the LENDER.
            body.borrowerId,
            body.amount,
            body.currency || "USD",
            body.reason,
            body.dueDate
        );
    }, {
        body: CreateLoanSchema,
        isAuth: true,
    })
    .get("/:id", async ({ user, params: { id } }: { user: User | null, params: { id: string } }) => {
        if (!user) throw new UnauthorizedError();
        return LoanService.getLoan(id, user.uid);
    }, {
        isAuth: true,
    })
    .patch("/:id/status", async ({ user, params: { id }, body }: { user: User | null, params: { id: string }, body: typeof UpdateLoanStatusSchema.static }) => {
        if (!user) throw new UnauthorizedError();
        await LoanService.updateStatus(id, user.uid, body.status);
        return { success: true };
    }, {
        body: UpdateLoanStatusSchema,
        isAuth: true,
    })
    .post("/:id/payments", async ({ user, params: { id }, body }: { user: User | null, params: { id: string }, body: typeof CreatePaymentSchema.static }) => {
        if (!user) throw new UnauthorizedError();
        return LoanService.addPayment(id, user.uid, body.amount, body.note, body.date);
    }, {
        body: CreatePaymentSchema,
        isAuth: true,
    })
    .get("/:id/payments", async ({ user, params: { id } }: { user: User | null, params: { id: string } }) => {
        if (!user) throw new UnauthorizedError();
        return LoanService.getLoanPayments(id, user.uid);
    }, {
        isAuth: true,
    });
