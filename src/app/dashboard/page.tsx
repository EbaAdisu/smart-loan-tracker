'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import LoanForm from '@/components/loans/LoanForm';
import LoanList from '@/components/loans/LoanList';
import PaymentForm from '@/components/payments/PaymentForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Notification from '@/components/ui/Notification';
import { useSession } from '@/lib/auth-client';
import {
  CreateLoanData,
  CreatePaymentData,
  Loan,
  UpdateLoanData,
} from '@/types';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] =
    useState<Loan | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans');
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLoan = async (data: CreateLoanData) => {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLoans();
        setShowAddForm(false);
        setNotification({
          message: 'Loan added successfully!',
          type: 'success',
        });
      } else {
        setNotification({
          message: 'Failed to add loan. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding loan:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    }
  };

  const handleEditLoan = async (data: UpdateLoanData) => {
    if (!editingLoan) return;

    try {
      const response = await fetch(`/api/loans/${editingLoan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLoans();
        setEditingLoan(null);
        setNotification({
          message: 'Loan updated successfully!',
          type: 'success',
        });
      } else {
        setNotification({
          message: 'Failed to update loan. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating loan:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;

    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLoans();
        setNotification({
          message: 'Loan deleted successfully!',
          type: 'success',
        });
      } else {
        setNotification({
          message: 'Failed to delete loan. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting loan:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    }
  };

  const handleAddPayment = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (loan) {
      setSelectedLoanForPayment(loan);
      setShowPaymentForm(true);
    }
  };

  const handleSubmitPayment = async (data: CreatePaymentData) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLoans();
        setShowPaymentForm(false);
        setSelectedLoanForPayment(null);
        setNotification({
          message: 'Payment added successfully!',
          type: 'success',
        });
      } else {
        setNotification({
          message: 'Failed to add payment. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    }
  };

  const calculateTotals = () => {
    const theyOweMe = loans
      .filter(
        (loan) => loan.loanType === 'THEY_OWE_ME' && loan.status === 'ACTIVE'
      )
      .reduce((sum, loan) => sum + Number(loan.remainingAmount), 0);

    const iOweThem = loans
      .filter(
        (loan) => loan.loanType === 'I_OWE_THEM' && loan.status === 'ACTIVE'
      )
      .reduce((sum, loan) => sum + Number(loan.remainingAmount), 0);

    return { theyOweMe, iOweThem };
  };

  const { theyOweMe, iOweThem } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {notification && (
          <Notification
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {session?.user.name}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track your loans and payments
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-background p-6 rounded-lg shadow border border-border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    They owe me
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(theyOweMe)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow border border-border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    I owe them
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(iOweThem)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Loan Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover font-medium"
            >
              Add New Loan
            </button>
          </div>

          {/* Forms */}
          {showAddForm && (
            <div className="mb-6 bg-background p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Loan
              </h2>
              <LoanForm
                onSubmit={handleAddLoan}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {editingLoan && (
            <div className="mb-6 bg-background p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Loan
              </h2>
              <LoanForm
                onSubmit={handleEditLoan}
                onCancel={() => setEditingLoan(null)}
              />
            </div>
          )}

          {showPaymentForm && selectedLoanForPayment && (
            <div className="mb-6 bg-background p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add Payment for {selectedLoanForPayment.personName}
              </h2>
              <PaymentForm
                loanId={selectedLoanForPayment.id}
                maxAmount={Number(selectedLoanForPayment.remainingAmount)}
                onSubmit={handleSubmitPayment}
                onCancel={() => {
                  setShowPaymentForm(false);
                  setSelectedLoanForPayment(null);
                }}
              />
            </div>
          )}

          {/* Loans List */}
          <div className="bg-background rounded-lg shadow border border-border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Loans
              </h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="lg" className="mx-auto" />
                  <p className="mt-2 text-muted-foreground">Loading loans...</p>
                </div>
              ) : (
                <LoanList
                  loans={loans}
                  onEdit={setEditingLoan}
                  onDelete={handleDeleteLoan}
                  onAddPayment={handleAddPayment}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
