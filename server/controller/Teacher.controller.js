import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import fs from 'fs/promises';
import User from "../models/user.model.js";
import { v2 as Cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken'; // Make sure to install and import jwt
import { Class, Point, Attendance, Activity } from "../models/index.model.js"


export const registerTeacher = asyncHandler(async (req, res, next) => {
    console.log("Register teacher route hit");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const {
        name,
        email,
        password,
        contactNumber, // Using contactNumber consistently
        address,
        gender,
        role = 'teacher' // Default role if not provided
    } = req.body;

    // Validation
    if (!name || !email || !password || !gender || !contactNumber || !address) {
        console.log("Missing required fields");
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: name, email, password, contactNumber, address, and gender'
        });
    }

    try {
        // Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            console.log("Email already registered:", email);
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default image
        let profilePic = {
            public_id: 'default_avatar_' + email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        };

        // Handle image upload if provided
        if (req.file) {
            try {
                console.log("Uploading image to Cloudinary...");
                const result = await Cloudinary.uploader.upload(req.file.path, {
                    folder: 'Teacher_folders',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                });

                profilePic = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                };

                // Delete temporary file after upload
                await fs.unlink(req.file.path);
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                // Clean up temp file even if upload fails
                await fs.unlink(req.file.path).catch(unlinkError =>
                    console.error('Failed to delete temp file:', unlinkError)
                );
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload profile picture',
                    error: uploadError.message
                });
            }
        }

        // Create user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: contactNumber, // Map contactNumber to phone field
            address,
            role,
            gender,
            profilePic, // Use the profilePic object we created
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Create safe user object without sensitive data
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            gender: user.gender,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        console.log("Teacher registered successfully:", email);
        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully',
            user: safeUser,
            token,
        });

    } catch (error) {
        console.error('User creation error:', error);
        // Clean up file if it exists and wasn't processed
        if (req.file) {
            await fs.unlink(req.file.path).catch(unlinkError =>
                console.error('Failed to delete temp file:', unlinkError)
            );
        }
        res.status(500).json({
            success: false,
            message: 'Failed to register teacher',
            error: error.message
        });
    }
});

// Create a new class
export const createClass = async (req, res) => {
    try {
        const { className } = req.body;

        // Validation
        if (!className) {
            return res.status(400).json({ message: "Class name is required." });
        }

        // Create the class
        const newClass = await Class.create({ className });

        return res.status(201).json({
            message: "Class created successfully!",
            data: newClass,
        });
    } catch (error) {
        console.error("Error creating class:", error);
        return res.status(500).json({
            message: "Something went wrong while creating the class.",
        });
    }
};






export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            order: [['createdAt', 'DESC']], // optional: sorts latest first
        });

        res.status(200).json({
            success: true,
            message: 'All classes retrieved successfully',
            data: classes,
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch classes',
            error: error.message,
        });
    }
};


export const getAllStudnet = async (req, res) => {
    const { classId } = req.params;
    console.log("class id display from back", classId)


    try {
        const students = await User.findAll({
            where: {
                classId: classId,
                role: 'student', // Ensures only students are returned
            },
            attributes: ['id', 'name', 'email', 'phone', 'classId', 'section', 'profilePic'],
            include: [
                {
                    model: Point,
                    as: 'points',
                    attributes: ['base_points', 'deduce_points', 'bonus_points', 'total_points'],
                }
            ]
        });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {
        console.error('Error fetching students by classId:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const markAttendance = async (req, res) => {
    try {
        const attendanceArray = req.body.attendance;
        if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) {
            return res.status(400).json({ message: "Attendance data is required and should be an array." });
        }

        // Process each attendance entry
        const results = [];
        for (const record of attendanceArray) {
            const { studentId, classId, status, date } = record;

            if (!studentId || !classId || !status || !date) {
                return res.status(400).json({ message: "Missing required fields in attendance record." });
            }

            // Upsert: create new or update existing attendance record for student, class, date
            const [attendance, created] = await Attendance.upsert(
                {
                    student_id: studentId,
                    class_id: classId,
                    date,
                    status,
                },
                { returning: true }
            );

            results.push(attendance);
        }

        return res.status(200).json({ message: "Attendance marked successfully.", data: results });
    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



export const createActivity = asyncHandler(async (req, res) => {
    const { studentId, activity, points } = req.body;

    // Validate inputs
    if (!studentId || !activity || points === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: studentId, classId, activity, points"
        });
    }

    try {
        const newActivity = await Activity.create({
            student_id: studentId,  // Assuming your Activity model has student_id field FK     
            activity,
            points,
            date: new Date().toISOString().split('T')[0], // store just YYYY-MM-DD part
        });

        return res.status(201).json({
            success: true,
            message: "Activity recorded successfully",
            data: newActivity,
        });
    } catch (error) {
        console.error("Error creating activity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record activity",
            error: error.message,
        });
    }
});