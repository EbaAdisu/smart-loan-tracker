import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LoanStatus } from '../../types/loan.types';
import { LOAN_STATUS_COLORS } from '../../utils/constants';

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
  const backgroundColor = LOAN_STATUS_COLORS[status] || LOAN_STATUS_COLORS.pending;
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text variant="labelSmall" style={styles.text}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default LoanStatusBadge;

