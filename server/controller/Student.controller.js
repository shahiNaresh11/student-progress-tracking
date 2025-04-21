import asyncHandler from 'express-async-handler';
import AppError from '../middlewares/error.middleware.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateJWTToken, cookieOptions } from '../utils/jwtUtils.js';

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and Password are required', 400));
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return next(new AppError('Email or Password do not match or user does not exist', 401));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(new AppError('Email or Password do not match or user does not exist', 401));
    }

    const token = generateJWTToken({ id: user.id, role: user.role });

    const { password: _pass, ...safeUser } = user.toJSON(); // exclude password

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: safeUser, // includes id, name, email, phone, address, img, role, etc.
    });
});


export const logoutUser = asyncHandler(async (_req, res) => {
    res.cookie('token', null, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
});
