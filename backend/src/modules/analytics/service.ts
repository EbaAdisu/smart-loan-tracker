import { db } from "../../core/db/firebase";
import { LoanStatus } from "../loan/model";

export class AnalyticsService {
    static async getUserStats(userId: string) {
        const loansRef = db.collection("loans");

        // Lender Stats
        const lenderLoansSnapshot = await loansRef.where("lenderId", "==", userId).get();
        const totalLent = lenderLoansSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        const activeLentLoans = lenderLoansSnapshot.docs.filter(doc => doc.data().status === LoanStatus.ACTIVE).length;
        const completedLentLoans = lenderLoansSnapshot.docs.filter(doc => doc.data().status === LoanStatus.COMPLETED).length;

        // Borrower Stats
        const borrowerLoansSnapshot = await loansRef.where("borrowerId", "==", userId).get();
        const totalBorrowed = borrowerLoansSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        const activeBorrowedLoans = borrowerLoansSnapshot.docs.filter(doc => doc.data().status === LoanStatus.ACTIVE).length;
        const completedBorrowedLoans = borrowerLoansSnapshot.docs.filter(doc => doc.data().status === LoanStatus.COMPLETED).length;
        const remainingDebt = borrowerLoansSnapshot.docs.reduce((sum, doc) => sum + (doc.data().balanceRemaining || 0), 0);

        return {
            lender: {
                totalLoans: lenderLoansSnapshot.size,
                totalAmount: totalLent,
                activeLoans: activeLentLoans,
                completedLoans: completedLentLoans,
            },
            borrower: {
                totalLoans: borrowerLoansSnapshot.size,
                totalAmount: totalBorrowed,
                activeLoans: activeBorrowedLoans,
                completedLoans: completedBorrowedLoans,
                remainingDebt,
            },
        };
    }

    static async getSystemStats() {
        // Admin only - potentially expensive if not using aggregations
        // Using count() aggregation for efficiency where possible
        const loansRef = db.collection("loans");
        const usersRef = db.collection("users");

        const totalUsers = (await usersRef.count().get()).data().count;
        const totalLoans = (await loansRef.count().get()).data().count;

        // For sums, we might need to fetch or use specific aggregation queries if available in the SDK version
        // Assuming standard fetch for now as it's safer without checking SDK version capabilities deeply
        // But for system stats, fetching ALL loans is bad.
        // Let's just return counts for now.

        return {
            totalUsers,
            totalLoans,
        };
    }
}
