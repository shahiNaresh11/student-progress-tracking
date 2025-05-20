import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import fs from 'fs/promises';
import User from "../models/user.model.js";
import { v2 as Cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken'; // Make sure to install and import jwt
import { Class } from "../models/index.model.js"

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
