'use client';

import PaymentForm from '@/components/payments/PaymentForm';
import PaymentList from '@/components/payments/PaymentList';
import { Button } from '@/components/ui/button';
import { CreatePaymentData, Payment } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    // Simulate loading payments
    const mockPayments: Payment[] = [
      {
        id: '1',
        name: 'John Doe',
        amount: 150.0,
        direction: 'owe',
        paymentDate: new Date('2024-01-15'),
        notes: 'Lunch money',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        amount: 75.5,
        direction: 'owed',
        paymentDate: new Date('2024-01-10'),
        notes: 'Movie tickets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setPayments(mockPayments);
  }, []);

  const handleCreatePayment = async (data: CreatePaymentData) => {
    setIsLoading(true);
    try {
      // Mock API call - will be replaced with actual API
      const newPayment: Payment = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setPayments((prev) => [newPayment, ...prev]);
      setShowForm(false);

      // Show success message (will be replaced with toast)
      console.log('Payment created successfully!');
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock API call - will be replaced with actual API
      setPayments((prev) => prev.filter((payment) => payment.id !== id));

      // Show success message (will be replaced with toast)
      console.log('Payment deleted successfully!');
    } catch (error) {
      console.error('Error deleting payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-2">
            Track who owes you money and who you owe
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <PaymentForm
            onSubmit={handleCreatePayment}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      <PaymentList
        payments={payments}
        onDelete={handleDeletePayment}
        isLoading={isLoading}
      />
    </div>
  );
}
