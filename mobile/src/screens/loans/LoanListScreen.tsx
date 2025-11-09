import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Chip, FAB, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loanApi } from '../../services/api/loanApi';
import { setLoans, setFilters, setLoading } from '../../store/slices/loanSlice';
import { RootState, AppDispatch } from '../../store';
import { LoansStackParamList } from '../../navigation/MainNavigator';
import LoanCard from '../../components/loans/LoanCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Loan, LoanFilters } from '../../types/loan.types';
import { storageService } from '../../services/storage.service';
import { theme } from '../../theme';

type LoanListScreenNavigationProp = StackNavigationProp<LoansStackParamList, 'LoanList'>;

const LoanListScreen: React.FC = () => {
  const navigation = useNavigation<LoanListScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loans, filters, loading } = useSelector((state: RootState) => state.loans);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLoans();
  }, [filters]);

  const loadLoans = async () => {
    dispatch(setLoading(true));
    try {
      const params: any = {};
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.type !== 'all') {
        params.role = filters.type === 'given' ? 'lender' : 'borrower';
      }

      const response = await loanApi.getLoans(params);
      if (response.success && response.data) {
        dispatch(setLoans(response.data));
        await storageService.setLoansCache(response.data);
      }
    } catch (error) {
      // Try to load from cache
      const cachedLoans = await storageService.getLoansCache();
      if (cachedLoans) {
        dispatch(setLoans(cachedLoans));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLoans();
    setRefreshing(false);
  };

  const filteredLoans = useMemo(() => {
    if (!searchQuery) return loans;

    const query = searchQuery.toLowerCase();
    return loans.filter(
      (loan) =>
        loan.lenderName.toLowerCase().includes(query) ||
        loan.borrowerName.toLowerCase().includes(query) ||
        loan.amount.toString().includes(query) ||
        loan.reason?.toLowerCase().includes(query)
    );
  }, [loans, searchQuery]);

  const handleFilterChange = (type: 'type' | 'status', value: string) => {
    dispatch(
      setFilters({
        ...filters,
        [type]: value,
      } as LoanFilters)
    );
  };

  if (loading && loans.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search loans..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filterContainer}>
        <View style={styles.chipRow}>
          <Chip
            selected={filters.type === 'all'}
            onPress={() => handleFilterChange('type', 'all')}
            style={styles.chip}
          >
            All
          </Chip>
          <Chip
            selected={filters.type === 'given'}
            onPress={() => handleFilterChange('type', 'given')}
            style={styles.chip}
          >
            Given
          </Chip>
          <Chip
            selected={filters.type === 'received'}
            onPress={() => handleFilterChange('type', 'received')}
            style={styles.chip}
          >
            Received
          </Chip>
        </View>

        <View style={styles.chipRow}>
          <Chip
            selected={filters.status === 'all'}
            onPress={() => handleFilterChange('status', 'all')}
            style={styles.chip}
          >
            All
          </Chip>
          <Chip
            selected={filters.status === 'active'}
            onPress={() => handleFilterChange('status', 'active')}
            style={styles.chip}
          >
            Active
          </Chip>
          <Chip
            selected={filters.status === 'overdue'}
            onPress={() => handleFilterChange('status', 'overdue')}
            style={styles.chip}
          >
            Overdue
          </Chip>
          <Chip
            selected={filters.status === 'completed'}
            onPress={() => handleFilterChange('status', 'completed')}
            style={styles.chip}
          >
            Completed
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LoanCard
            loan={item}
            onPress={() => navigation.navigate('LoanDetail', { loanId: item.id })}
            currentUserId={user?.id || ''}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No loans found
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateLoan')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchbar: {
    margin: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: theme.colors.placeholder,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default LoanListScreen;

