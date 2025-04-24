import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import { generateJWTToken } from '../utils/jwtUtils.js';
import User from '../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';
import AppError from '../middlewares/error.middleware.js';

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = asyncHandler(async (req, res, next) => {
    console.log("📩 Register route hit");

    // Log raw request content
    console.log("🧾 req.body:", req.body);
    console.log("📎 req.file:", req.file);

    const {
        name,
        email,
        password,
        phone,
        address,
        studentClass,
        section,
        gender,
        role,
    } = req.body;

    if (!name || !email || !password || !studentClass || !section || !gender) {
        console.log("❌ Missing required fields");
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: name, email, password, class, section, and gender'
        });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            console.log("⚠️ Email already registered:", email);
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let img = {
            public_id: 'default_avatar_' + email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        };

        if (req.file) {
            try {
                console.log("🖼️ Uploading image to Cloudinary...");
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'student_profiles',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                });

                img = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                };

                await fs.rm(req.file.path);
            } catch (error) {
                console.error('❌ Image upload error:', error);
            }
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
            studentClass,
            section,
            gender,
            img,
        });

        const token = generateJWTToken(user.id);
        const { password: _, ...safeUser } = user.toJSON();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("✅ User registered:", email);
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            user: safeUser,
            token,
        });

    } catch (error) {
        console.error('❌ User creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register student',
            error: error.message
        });
    }
});


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
