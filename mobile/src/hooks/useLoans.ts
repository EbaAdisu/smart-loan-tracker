import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setLoans, setFilters, setSelectedLoan } from '../store/slices/loanSlice';
import { loanApi } from '../services/api/loanApi';

export const useLoans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loans = useSelector((state: RootState) => state.loans);

  const loadLoans = async (filters?: { status?: string; role?: string }) => {
    try {
      const response = await loanApi.getLoans(filters);
      if (response.success && response.data) {
        dispatch(setLoans(response.data));
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error loading loans:', error);
      return [];
    }
  };

  return {
    ...loans,
    loadLoans,
    setFilters: (filters: any) => dispatch(setFilters(filters)),
    setSelectedLoan: (loan: any) => dispatch(setSelectedLoan(loan)),
  };
};

