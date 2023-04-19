import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  loading: false,
  error: null,
  token: null,
  verify_loading: false,
  verify_error: null,
  verify_success: null,
  reset_loading: false,
  reset_error: null,
  reset_success: null,
};

export const forgotpasswordfun = createAsyncThunk(
  '/post/forgot-password',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(config.apiUrl + 'forgot-password', {
        email: data.email,
      });
      await AsyncStorage.setItem('verify_token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const verify_forgot = createAsyncThunk(
  '/post/verify-forgotpwd',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(config.apiUrl + 'verify-otp', {
        token: data.token,
        otp: data.otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const reset_password = createAsyncThunk(
  '/post/reset-password',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(config.apiUrl + 'reset-password', {
        token: data.token,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const forgotpwd = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(forgotpasswordfun.pending, state => {
        state.loading = true;
        state.error = null;
        state.token = '';
      })
      .addCase(forgotpasswordfun.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        console.log(action.payload.token+"token");
        // send success message to the user and show the otp down
        state.error = null;
      })
      .addCase(forgotpasswordfun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Server error';
        state.token = '';
      });
    builder
      .addCase(verify_forgot.pending, state => {
        state.verify_loading = true;
        state.verify_error = null;
        state.verify_success = '';
      })
      .addCase(verify_forgot.fulfilled, (state, action) => {
        state.verify_loading = false;
        state.verify_success = 'User verifird successfully';
        // navigate to the password reset page
        state.verify_error = null;
      })
      .addCase(verify_forgot.rejected, (state, action) => {
        state.verify_loading = false;
        state.verify_error = action.payload || 'Server error';
        state.verify_success = '';
      });
    builder
      .addCase(reset_password.pending, state => {
        state.reset_loading = true;
        state.reset_error = null;
        state.reset_success = '';
      })
      .addCase(reset_password.fulfilled, (state, action) => {
        state.reset_loading = false;
        state.reset_success = 'password reset successfully';
        // navigate to the login page
        state.reset_error = null;
      })
      .addCase(reset_password.rejected, (state, action) => {
        state.reset_loading = false;
        state.reset_error = action.payload || 'Server error';
        state.reset_success = '';
      });
  },
});

export default forgotpwd.reducer;
