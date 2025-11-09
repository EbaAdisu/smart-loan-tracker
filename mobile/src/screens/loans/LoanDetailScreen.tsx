import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider, ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { loanApi } from '../../services/api/loanApi';
import { setSelectedLoan, updateLoan } from '../../store/slices/loanSlice';
import { RootState, AppDispatch } from '../../store';
import { LoansStackParamList } from '../../navigation/MainNavigator';
import LoanStatusBadge from '../../components/loans/LoanStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { theme } from '../../theme';

type LoanDetailScreenRouteProp = RouteProp<LoansStackParamList, 'LoanDetail'>;
type LoanDetailScreenNavigationProp = StackNavigationProp<LoansStackParamList, 'LoanDetail'>;

const LoanDetailScreen: React.FC = () => {
  const route = useRoute<LoanDetailScreenRouteProp>();
  const navigation = useNavigation<LoanDetailScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLoan } = useSelector((state: RootState) => state.loans);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadLoanDetails();
  }, [route.params.loanId]);

  const loadLoanDetails = async () => {
    setLoading(true);
    try {
      const [loanResponse, paymentsResponse] = await Promise.all([
        loanApi.getLoan(route.params.loanId),
        loanApi.getPaymentHistory(route.params.loanId),
      ]);

      if (loanResponse.success && loanResponse.data) {
        dispatch(setSelectedLoan(loanResponse.data));
      }

      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(paymentsResponse.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !selectedLoan) {
    return <LoadingSpinner />;
  }

  const isLender = selectedLoan.lenderUserId === user?.id;
  const otherPartyName = isLender ? selectedLoan.borrowerName : selectedLoan.lenderName;
  const progress = selectedLoan.amount > 0 
    ? (selectedLoan.amount - selectedLoan.balanceRemaining) / selectedLoan.amount 
    : 0;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall" style={styles.name}>
                {otherPartyName}
              </Text>
              <Text variant="bodyMedium" style={styles.role}>
                {isLender ? 'You lent to' : 'You borrowed from'}
              </Text>
            </View>
            <LoanStatusBadge status={selectedLoan.status} />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.amountSection}>
            <Text variant="headlineMedium" style={styles.amount}>
              {formatCurrency(selectedLoan.amount)}
            </Text>
            {selectedLoan.balanceRemaining > 0 && (
              <>
                <Text variant="bodyMedium" style={styles.balance}>
                  Remaining: {formatCurrency(selectedLoan.balanceRemaining)}
                </Text>
                <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />
              </>
            )}
          </View>

          {selectedLoan.reason && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text variant="labelLarge" style={styles.label}>
                  Reason
                </Text>
                <Text variant="bodyMedium">{selectedLoan.reason}</Text>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.label}>
              Due Date
            </Text>
            <Text variant="bodyMedium">{formatDate(selectedLoan.dueDate)}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.label}>
              Created
            </Text>
            <Text variant="bodyMedium">{formatDate(selectedLoan.createdAt)}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Payment History
          </Text>
          {payments.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No payments recorded yet
            </Text>
          ) : (
            payments.map((payment, index) => (
              <View key={payment.id}>
                <View style={styles.paymentItem}>
                  <View>
                    <Text variant="bodyLarge" style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Text variant="bodySmall" style={styles.paymentDate}>
                      {formatDate(payment.createdAt)}
                    </Text>
                    {payment.notes && (
                      <Text variant="bodySmall" style={styles.paymentNotes}>
                        {payment.notes}
                      </Text>
                    )}
                  </View>
                </View>
                {index < payments.length - 1 && <Divider />}
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {selectedLoan.balanceRemaining > 0 && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('RecordPayment', { loanId: selectedLoan.id })}
            style={styles.button}
          >
            Record Payment
          </Button>
        )}
        {isLender && (
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditLoan', { loanId: selectedLoan.id })}
            style={styles.button}
          >
            Edit Loan
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Chat', { loanId: selectedLoan.id })}
          style={styles.button}
        >
          Send Message
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    color: theme.colors.placeholder,
  },
  divider: {
    marginVertical: 16,
  },
  amountSection: {
    marginBottom: 16,
  },
  amount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  balance: {
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  progress: {
    height: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentItem: {
    paddingVertical: 12,
  },
  paymentAmount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDate: {
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  paymentNotes: {
    color: theme.colors.placeholder,
  },
  emptyText: {
    color: theme.colors.placeholder,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    marginBottom: 12,
  },
});

export default LoanDetailScreen;

