
import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated , sendResetPasswordOtp , resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-authenticated', userAuth, isAuthenticated);
authRouter.post('/send-reset-password-otp', userAuth, sendResetPasswordOtp);
authRouter.post('/reset-password', userAuth, resetPassword);


export default authRouter;

