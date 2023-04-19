import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeLogin} from '../Signup/signupSlice';

const initialState = {
  loading: false,
  error: null,
  token: null,
  resend_loading: false,
  resend_error: null,
  resend_token: null,
};

export const loginuser = createAsyncThunk(
  '/post/login',
  async (data, {rejectWithValue,dispatch}) => {
    try {
      const response = await axios.post(config.apiUrl + 'login', {
        email: data.email,
        password: data.password,
      });
      await AsyncStorage.setItem('token', response.data.token);
      dispatch(makeLogin("abe"));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const resendverifyotp = createAsyncThunk(
  '/post/resend-verify-otp',
  async (data, {rejectWithValue, dispatch}) => {
    try {
      const response = await axios.post(config.apiUrl + 'reset-otp', {
        email: data.email,
      });
      await AsyncStorage.setItem('token', response.data.token);
      dispatch(makeLogin("abc"));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const loginSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginuser.pending, state => {
        state.loading = true;
        state.error = null;
        state.token = '';
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        // move to home page
        state.error = null;
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Server error';
        state.token = '';
      });
    builder
      .addCase(resendverifyotp.pending, state => {
        state.resend_loading = true;
        state.resend_error = null;
        state.resend_token = '';
      })
      .addCase(resendverifyotp.fulfilled, (state, action) => {
        state.resend_loading = false;
        state.resend_token = action.payload.token;
        // store the token in resend_token and move to the verification page
        state.resend_error = null;
      })
      .addCase(resendverifyotp.rejected, (state, action) => {
        state.resend_loading = false;
        state.resend_error = action.payload || 'Server error';
        state.resend_token = '';
      });
  },
});

export default loginSlice.reducer;
