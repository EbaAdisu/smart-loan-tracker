import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, signup, logout, checkSession } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (credentials: { email: string; password: string }) =>
      dispatch(login(credentials)),
    signup: (data: { email: string; password: string; name: string }) =>
      dispatch(signup(data)),
    logout: () => dispatch(logout()),
    checkSession: () => dispatch(checkSession()),
  };
};

