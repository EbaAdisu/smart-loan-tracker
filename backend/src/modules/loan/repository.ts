import { db } from "../../core/db/firebase";
import { Loan, Payment } from "./model";

const LOANS_COLLECTION = "loans";
const PAYMENTS_COLLECTION = "payments";

export class LoanRepository {
    static async create(loan: Loan): Promise<Loan> {
        await db.collection(LOANS_COLLECTION).doc(loan.id).set(loan);
        return loan;
    }

    static async findById(id: string): Promise<Loan | null> {
        const doc = await db.collection(LOANS_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return doc.data() as Loan;
    }

    static async findByUser(userId: string, role?: "lender" | "borrower"): Promise<Loan[]> {
        let query = db.collection(LOANS_COLLECTION).where("lenderId", "==", userId);

        if (role === "borrower") {
            query = db.collection(LOANS_COLLECTION).where("borrowerId", "==", userId);
        } else if (!role) {
            // If no role specified, we need to query both (Firestore OR queries are limited, so we might need two queries)
            // For simplicity, let's fetch where user is lender OR borrower
            // Note: Firestore "in" query works on a single field. 
            // We'll implement a service-level merge or two queries here.
            const lenderLoans = await db.collection(LOANS_COLLECTION).where("lenderId", "==", userId).get();
            const borrowerLoans = await db.collection(LOANS_COLLECTION).where("borrowerId", "==", userId).get();

            const loans = new Map<string, Loan>();
            lenderLoans.forEach(doc => loans.set(doc.id, doc.data() as Loan));
            borrowerLoans.forEach(doc => loans.set(doc.id, doc.data() as Loan));

            return Array.from(loans.values());
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => doc.data() as Loan);
    }

    static async update(id: string, data: Partial<Loan>): Promise<void> {
        await db.collection(LOANS_COLLECTION).doc(id).update({
            ...data,
            updatedAt: new Date().toISOString(),
        });
    }

    static async addPayment(payment: Payment): Promise<Payment> {
        await db.collection(PAYMENTS_COLLECTION).doc(payment.id).set(payment);
        return payment;
    }

    static async getPaymentsByLoanId(loanId: string): Promise<Payment[]> {
        const snapshot = await db.collection(PAYMENTS_COLLECTION)
            .where("loanId", "==", loanId)
            .orderBy("date", "desc")
            .get();
        return snapshot.docs.map(doc => doc.data() as Payment);
    }
}
