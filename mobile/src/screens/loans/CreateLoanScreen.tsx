import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { loanApi } from '../../services/api/loanApi';
import { userApi } from '../../services/api/userApi';
import { addLoan } from '../../store/slices/loanSlice';
import { RootState, AppDispatch } from '../../store';
import { LoansStackParamList } from '../../navigation/MainNavigator';
import { createLoanSchema } from '../../utils/validators';
import { formatDateInput } from '../../utils/formatters';
import { User } from '../../types/auth.types';
import { theme } from '../../theme';

type CreateLoanScreenNavigationProp = StackNavigationProp<LoansStackParamList, 'CreateLoan'>;

const CreateLoanScreen: React.FC = () => {
  const navigation = useNavigation<CreateLoanScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<User | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      borrowerUserId: '',
      amount: '',
      reason: '',
      dueDate: formatDateInput(new Date()),
    },
  });

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      const response = await userApi.searchUsers(searchQuery);
      if (response.success && response.data) {
        setSearchResults(response.data.filter((u) => u.id !== user?.id));
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const selectBorrower = (borrower: User) => {
    setSelectedBorrower(borrower);
    setValue('borrowerUserId', borrower.id);
    setSearchQuery(borrower.name);
    setSearchResults([]);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
      setValue('dueDate', formatDateInput(selectedDate));
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedBorrower || !user) {
      Alert.alert('Error', 'Please select a borrower');
      return;
    }

    setLoading(true);
    try {
      const response = await loanApi.createLoan({
        lenderUserId: user.id,
        borrowerUserId: selectedBorrower.id,
        lenderName: user.name,
        borrowerName: selectedBorrower.name,
        amount: parseFloat(data.amount),
        reason: data.reason || undefined,
        dueDate: data.dueDate,
      });

      if (response.success && response.data) {
        dispatch(addLoan(response.data));
        Alert.alert('Success', 'Loan created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.error?.message || 'Failed to create loan');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create loan');
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
            name="borrowerUserId"
            render={({ field: { value } }) => (
              <View>
                <TextInput
                  label="Borrower"
                  value={selectedBorrower ? selectedBorrower.name : searchQuery}
                  onChangeText={setSearchQuery}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.borrowerUserId}
                />
                {errors.borrowerUserId && (
                  <Text style={styles.error}>{errors.borrowerUserId.message}</Text>
                )}
                {searchResults.length > 0 && (
                  <View style={styles.searchResults}>
                    {searchResults.map((user) => (
                      <Button
                        key={user.id}
                        onPress={() => selectBorrower(user)}
                        style={styles.resultItem}
                      >
                        {user.name} ({user.email})
                      </Button>
                    ))}
                  </View>
                )}
              </View>
            )}
          />

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
                {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Reason (Optional)"
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
                {errors.dueDate && <Text style={styles.error}>{errors.dueDate.message}</Text>}
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          >
            Create Loan
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
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  searchResults: {
    marginTop: -8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    borderRadius: 4,
    maxHeight: 200,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.placeholder,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default CreateLoanScreen;

