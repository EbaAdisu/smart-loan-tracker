import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { loanApi } from '../../services/api/loanApi';
import { updateLoan as updateLoanAction } from '../../store/slices/loanSlice';
import { RootState, AppDispatch } from '../../store';
import { LoansStackParamList } from '../../navigation/MainNavigator';
import { updateLoanSchema } from '../../utils/validators';
import { formatDateInput } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

type EditLoanScreenRouteProp = RouteProp<LoansStackParamList, 'EditLoan'>;
type EditLoanScreenNavigationProp = StackNavigationProp<LoansStackParamList, 'EditLoan'>;

const EditLoanScreen: React.FC = () => {
  const route = useRoute<EditLoanScreenRouteProp>();
  const navigation = useNavigation<EditLoanScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loans } = useSelector((state: RootState) => state.loans);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loan = loans.find((l) => l.id === route.params.loanId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateLoanSchema),
    defaultValues: {
      amount: loan?.amount.toString() || '',
      reason: loan?.reason || '',
      dueDate: loan ? formatDateInput(new Date(loan.dueDate)) : formatDateInput(new Date()),
      status: loan?.status || 'active',
    },
  });

  useEffect(() => {
    if (loan) {
      setValue('amount', loan.amount.toString());
      setValue('reason', loan.reason || '');
      setValue('dueDate', formatDateInput(new Date(loan.dueDate)));
      setValue('status', loan.status);
    }
  }, [loan, setValue]);

  if (!loan) {
    return <LoadingSpinner />;
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('dueDate', formatDateInput(selectedDate));
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await loanApi.updateLoan(route.params.loanId, {
        amount: data.amount ? parseFloat(data.amount) : undefined,
        reason: data.reason || undefined,
        dueDate: data.dueDate,
        status: data.status,
      });

      if (response.success && response.data) {
        dispatch(updateLoanAction(response.data));
        Alert.alert('Success', 'Loan updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.error?.message || 'Failed to update loan');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Amount"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.amount}
              />
            )}
          />

          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Reason"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field: { value } }) => (
              <View>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  Due Date: {value || 'Select date'}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(value || new Date())}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Status"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                style={styles.input}
                editable={false}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          >
            Save Changes
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
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default EditLoanScreen;

