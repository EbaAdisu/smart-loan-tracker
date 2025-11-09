import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Loan, LoanFilters } from '../../types/loan.types';

interface LoanState {
  loans: Loan[];
  selectedLoan: Loan | null;
  filters: LoanFilters;
  loading: boolean;
}

const initialState: LoanState = {
  loans: [],
  selectedLoan: null,
  filters: {
    type: 'all',
    status: 'all',
  },
  loading: false,
};

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoans: (state, action: PayloadAction<Loan[]>) => {
      state.loans = action.payload;
    },
    addLoan: (state, action: PayloadAction<Loan>) => {
      state.loans.push(action.payload);
    },
    updateLoan: (state, action: PayloadAction<Loan>) => {
      const index = state.loans.findIndex((loan) => loan.id === action.payload.id);
      if (index !== -1) {
        state.loans[index] = action.payload;
      }
      if (state.selectedLoan?.id === action.payload.id) {
        state.selectedLoan = action.payload;
      }
    },
    removeLoan: (state, action: PayloadAction<string>) => {
      state.loans = state.loans.filter((loan) => loan.id !== action.payload);
      if (state.selectedLoan?.id === action.payload) {
        state.selectedLoan = null;
      }
    },
    setSelectedLoan: (state, action: PayloadAction<Loan | null>) => {
      state.selectedLoan = action.payload;
    },
    setFilters: (state, action: PayloadAction<LoanFilters>) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearLoans: (state) => {
      state.loans = [];
      state.selectedLoan = null;
    },
  },
});

export const {
  setLoans,
  addLoan,
  updateLoan,
  removeLoan,
  setSelectedLoan,
  setFilters,
  setLoading,
  clearLoans,
} = loanSlice.actions;
export default loanSlice.reducer;

