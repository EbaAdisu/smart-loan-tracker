import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanApi } from '../../services/api/loanApi';
import { updateLoan } from '../../store/slices/loanSlice';
import { RootState, AppDispatch } from '../../store';
import { LoansStackParamList } from '../../navigation/MainNavigator';
import { recordPaymentSchema } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

type RecordPaymentScreenRouteProp = RouteProp<LoansStackParamList, 'RecordPayment'>;
type RecordPaymentScreenNavigationProp = StackNavigationProp<LoansStackParamList, 'RecordPayment'>;

const RecordPaymentScreen: React.FC = () => {
  const route = useRoute<RecordPaymentScreenRouteProp>();
  const navigation = useNavigation<RecordPaymentScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loans } = useSelector((state: RootState) => state.loans);
  const [loading, setLoading] = useState(false);

  const loan = loans.find((l) => l.id === route.params.loanId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      amount: '',
      notes: '',
    },
  });

  if (!loan) {
    return <LoadingSpinner />;
  }

  const onSubmit = async (data: { amount: number; notes?: string }) => {
    if (data.amount > loan.balanceRemaining) {
      Alert.alert('Error', 'Payment amount cannot exceed remaining balance');
      return;
    }

    setLoading(true);
    try {
      const response = await loanApi.recordPayment(route.params.loanId, {
        amount: data.amount,
        notes: data.notes,
      });

      if (response.success && response.data) {
        // Update loan with new balance
        const updatedLoan = await loanApi.getLoan(route.params.loanId);
        if (updatedLoan.success && updatedLoan.data) {
          dispatch(updateLoan(updatedLoan.data));
        }

        Alert.alert('Success', 'Payment recorded successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.error?.message || 'Failed to record payment');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Loan Information
          </Text>
          <Text variant="bodyMedium" style={styles.info}>
            Total Amount: {formatCurrency(loan.amount)}
          </Text>
          <Text variant="bodyMedium" style={styles.info}>
            Remaining Balance: {formatCurrency(loan.balanceRemaining)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Payment Details
          </Text>

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  label="Amount"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.amount}
                />
                {errors.amount && (
                  <Text style={styles.error}>{errors.amount.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Notes (Optional)"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          >
            Record Payment
          </Button>
        </Card.Content>
      </Card>
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
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default RecordPaymentScreen;

