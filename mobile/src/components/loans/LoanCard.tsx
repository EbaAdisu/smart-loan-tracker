import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Loan } from '../../types/loan.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoanStatusBadge from './LoanStatusBadge';
import { theme } from '../../theme';

interface LoanCardProps {
  loan: Loan;
  onPress: () => void;
  currentUserId: string;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, onPress, currentUserId }) => {
  const isLender = loan.lenderUserId === currentUserId;
  const otherPartyName = isLender ? loan.borrowerName : loan.lenderName;
  const role = isLender ? 'Given' : 'Received';

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text variant="titleMedium" style={styles.name}>
                {otherPartyName}
              </Text>
              <Text variant="bodySmall" style={styles.role}>
                {role}
              </Text>
            </View>
            <LoanStatusBadge status={loan.status} />
          </View>

          <View style={styles.amountContainer}>
            <Text variant="headlineSmall" style={styles.amount}>
              {formatCurrency(loan.amount)}
            </Text>
            {loan.balanceRemaining > 0 && (
              <Text variant="bodySmall" style={styles.balance}>
                Remaining: {formatCurrency(loan.balanceRemaining)}
              </Text>
            )}
          </View>

          {loan.reason && (
            <Text variant="bodyMedium" style={styles.reason} numberOfLines={2}>
              {loan.reason}
            </Text>
          )}

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.date}>
              Due: {formatDate(loan.dueDate)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    color: theme.colors.placeholder,
  },
  amountContainer: {
    marginBottom: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  balance: {
    color: theme.colors.placeholder,
  },
  reason: {
    marginBottom: 8,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.placeholder,
  },
});

export default LoanCard;

