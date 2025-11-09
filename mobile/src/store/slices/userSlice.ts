import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi, UpdateProfileData } from '../../services/api/userApi';
import { User } from '../../types/auth.types';

interface UserState {
  profile: User | null;
  deviceToken: string | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  deviceToken: null,
  loading: false,
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.deviceToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setProfile, setDeviceToken, clearProfile } = userSlice.actions;
export default userSlice.reducer;

