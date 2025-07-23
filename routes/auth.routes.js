const express = require('express');
const AuthController = require('../controllers/auth.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const { 
    validateRegistration,
    validateLogin,
    validateEmailVerification,
    validatePasswordReset
} = require('../middleware/validation.middleware.js');

const router = express.Router();

// Public Routes
router.post('/register', 
    validateRegistration, 
    AuthController.register
);

router.post('/verify-email', 
    validateEmailVerification, 
    AuthController.verifyEmail
);

router.post('/login', 
    validateLogin, 
    AuthController.login
);

router.post('/forgot-password', 
    AuthController.forgotPassword
);

router.post('/reset-password', 
    validatePasswordReset, 
    AuthController.resetPassword
);

// Protected Routes
router.post('/logout', 
    authMiddleware, 
    AuthController.logout
);

module.exports = router;