import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import { generateJWTToken } from '../utils/jwtUtils.js';
import { v2 as cloudinary } from 'cloudinary';
import AppError from '../middlewares/error.middleware.js';
import { User, Point, Attendance, sequelize, Activity, Assignment, Class } from '../models/index.model.js';

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = asyncHandler(async (req, res, next) => {
    console.log("Register route hit");

    // Log raw request content
    console.log("🧾 req.body:", req.body);
    console.log("📎 req.file:", req.file);

    const {
        name,
        email,
        password,
        phone,
        address,
        classId,
        section,
        gender,
        role,
    } = req.body;

    if (!name || !email || !password || !classId || !section || !gender) {
        console.log(" Missing required fields");
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: name, email, password, class, section, and gender'
        });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            console.log(" Email already registered:", email);
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
                console.log(" Uploading image to Cloudinary...");
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
                console.error(' Image upload error:', error);
            }
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
            classId,
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

        console.log(" User registered:", email);
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            user: safeUser,
            token,
        });

    } catch (error) {
        console.error(' User creation error:', error);
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


export const getLoggedInUserDetails = asyncHandler(async (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
        return next(new AppError('User not authenticated', 401));
    }

    console.log("Logged-in user ID:", req.user.id);
    const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Point,
                as: 'points',
                attributes: ['base_points', 'deduce_points', 'bonus_points', 'total_points'],
            },
            {
                model: Class,
                as: 'class',
                attributes: ['id', 'className']
            }
        ],
    });
    console.log(user);


    if (!user) {
        return next(new AppError('User not found', 404));
    }


    res.status(200).json({
        success: true,
        message: 'User details with points',
        user,
    });
});




export const getStudentAttendance = asyncHandler(async (req, res, next) => {
    const studentId = req.user?.id; // ✅ Use ID from the JWT (via middleware)

    if (!studentId) {
        return next(new AppError('User not authenticated', 401));
    }

    // 1. Find student basic info (without attendances yet)
    const student = await User.findOne({
        where: { id: studentId, role: 'student' },
        attributes: ['id', 'name', 'email', 'classId', 'section'],
    });

    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found',
        });
    }

    // 2. Aggregate attendance counts
    const attendanceCounts = await Attendance.findAll({
        where: { student_id: studentId },
        attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status'],
    });

    const summary = {
        present: 0,
        absent: 0,
        late: 0,
    };

    attendanceCounts.forEach(record => {
        summary[record.status] = parseInt(record.get('count'));
    });

    // 3. Fetch all attendance records (optional, for listing on frontend)
    const attendances = await Attendance.findAll({
        where: { student_id: studentId },
        attributes: ['id', 'date', 'status', 'remarks', 'createdAt'],
        order: [['date', 'DESC']],
    });

    // 4. Respond
    res.status(200).json({
        success: true,
        message: `Attendance records for ${student.name}`,
        student,
        summary,
        attendances,
    });
});


export const getStudentActivities = asyncHandler(async (req, res, next) => {
    const studentId = req.user?.id;

    if (!studentId) {
        return next(new AppError('User not authenticated', 401));
    }

    // // Check if the student exists and is of role 'student'
    // const student = await User.findOne({
    //     where: { id: studentId, role: 'student' },
    //     // attributes: ['id', 'name', 'email', 'student', 'section'],
    // });

    // if (!student) {
    //     return next(new AppError('Student not found or not authorized', 404));
    // }

    // Get activity logs for the student
    const activities = await Activity.findAll({
        where: { student_id: studentId },
        order: [['createdAt', 'DESC']],
        // attributes: ['id', 'activity', 'description', 'createdAt'],
    });

    res.status(200).json({
        success: true,
        message: `Activity records for ID ${studentId}`,
        activities,
    });
});

export const getStudentAssignments = asyncHandler(async (req, res, next) => {
    const studentId = req.user?.id;

    const assignments = await Assignment.findAll({
        where: { student_id: studentId },
        attributes: ['id', 'title', 'status', 'dueDate', 'submittedAt'],
        order: [['dueDate', 'DESC']],
    });

    const summary = {
        total: assignments.length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        late: assignments.filter(a => a.status === 'late').length,
        missed: assignments.filter(a => a.status === 'missed').length,
    };

    res.status(200).json({
        success: true,
        message: `Assignments summary for student ${studentId}`,
        summary,
        assignments,
    });
});
