import {configureStore} from '@reduxjs/toolkit';
import signupReducer from '../features/Signup/signupSlice';
import loginReducer from '../features/Login/loginSlice';
import forgotpwdReducer from '../features/Forgotpassword/forgotpwdSlice';

export default store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    forgotpwd: forgotpwdReducer,
  },
});
