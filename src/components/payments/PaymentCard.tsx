'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface PaymentCardProps {
  payment: Payment;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function PaymentCard({
  payment,
  onDelete,
  isLoading = false,
}: PaymentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDelete = () => {
    onDelete(payment.id);
    setShowDeleteConfirm(false);
  };

  const isOwe = payment.direction === 'owe';
  const directionColor = isOwe ? 'text-red-600' : 'text-green-600';
  const directionBg = isOwe
    ? 'bg-red-50 border-red-200'
    : 'bg-green-50 border-green-200';

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {payment.name}
            </CardTitle>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${directionBg}`}
            >
              {isOwe ? (
                <ArrowLeft className="h-3 w-3" />
              ) : (
                <ArrowRight className="h-3 w-3" />
              )}
              <span className={directionColor}>
                {isOwe ? 'I owe' : 'They owe me'}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="h-8 w-8 text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className={`text-lg font-bold ${directionColor}`}>
              {isOwe ? '-' : '+'}
              {formatAmount(payment.amount)}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(payment.paymentDate)}</span>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{payment.notes}</span>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="bg-background border rounded-lg p-4 shadow-lg max-w-xs mx-4">
              <h4 className="font-semibold text-foreground mb-2">
                Delete Payment?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
