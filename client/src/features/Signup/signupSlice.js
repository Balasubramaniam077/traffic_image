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
  isloggedin: null,
};

export const signupUser = createAsyncThunk(
  '/post/signup',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(config.apiUrl + 'register', {
        email: data.email,
        password: data.password,
      });
      await AsyncStorage.setItem('verify_token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const VerifyUser = createAsyncThunk(
  '/post/verify-user',
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

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    logout: state => {
      state.isloggedin = '';
    },
    makeLogin: (state, action) => {
      state.isloggedin = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.token = '';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        // save the token in token move to the otp-verification page
        console.log('otp send');
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Server error';
        state.token = '';
      });
    builder
      .addCase(VerifyUser.pending, state => {
        state.verify_loading = true;
        state.verify_error = null;
        state.verify_success = '';
      })
      .addCase(VerifyUser.fulfilled, (state, action) => {
        state.verify_loading = false;
        state.verify_success = 'User verified successfully';
        // store the token and navigate to the home page
        AsyncStorage.setItem('token', action.payload.token);
        state.isloggedin = action.payload.token;
        state.verify_error = null;
      })
      .addCase(VerifyUser.rejected, (state, action) => {
        state.verify_loading = false;
        state.verify_error = action.payload || 'Server error';
        state.verify_success = '';
      });
  },
});

export default signupSlice.reducer;
export const {logout, makeLogin} = signupSlice.actions;
