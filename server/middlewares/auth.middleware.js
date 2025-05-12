import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AppError from './error.middleware.js'; // Adjust the path if necessary

// Middleware to check if user is logged in
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthorized: Please login to continue", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Explicitly set the user ID
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
});

// Middleware to check if user has one of the allowed roles
export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: You do not have permission to access this resource", 403)
      );
    }
    next();
  };
};
