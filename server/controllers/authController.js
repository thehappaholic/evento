import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({success: false, message: "All fields are required" });
    }

    try {

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        //sending welcome email
        const mailOptions = {
            from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Welcome to Evento",
            text: `Hi ${name},\n\nWelcome to Evento! We’re excited to have you onboard. Start creating, discovering, and enjoying unforgettable events today. 🎉\n\nCheers,\nThe Evento Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Account Created Successfully", user });

    } catch (error) {
        res.json({ success: false,  message: "OOPS, Account Creation Failed" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({ success: true, message: "Login successful", user });

    } catch (error) {
        res.json({ success: false, message: "OOPS, Login Failed" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "Logged Out" });

    } catch (error) {
        return res.json({ success: false, message: "OOPS, Logout Failed" });
    }
}

//send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {

    try {

        const {userId} = req.body;
        const user = await UserModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account is already verified" })
        }

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Save OTP to user document
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours

        await user.save();

        // Send OTP email
        const mailOptions = {
            from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Verify your email",
            text: `Your verification code is ${otp}. Verify your email within 24 hours with this OTP.
             Thank you!.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification OTP sent on Email" });

    } catch (error) {
        return res.json({ success: false, message: "OOPS, Something went wrong" });
    }
}
//send verifiedemail
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.json({ success: false, message: "OOPS, Something went wrong" });
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: "User is authenticated" });

    } catch (error) {
        res.json({ success: false, message: "Invalid token" });
    }
}

//send password reset otp
export const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        await user.save();

        // Send OTP email
        const mailOptions = {
            from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Reset your password",
            text: `Your password reset OTP is ${otp}. It is valid for 15 minutes.`
        };

        await transporter.sendMail( mailOptions );

        return res.json({ success: true, message: "Password reset OTP sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: "OOPS, Something went wrong" });
    }

}

//reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetPasswordOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordOtp = '';
        user.resetPasswordOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: "OOPS, Something went wrong" });
    }
}