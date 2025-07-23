const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }
    next();
};

// Registration Validation
const validateRegistration = [
    body('firstName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),
    
    body('lastName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character'),
    
    validateRequest
];

// Login Validation
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    validateRequest
];

// Email Verification Validation
const validateEmailVerification = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    
    body('otp')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits'),
    
    validateRequest
];

// Password Reset Validation
const validatePasswordReset = [
    body('token')
        .trim()
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character'),
    
    validateRequest
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateEmailVerification,
    validatePasswordReset
};