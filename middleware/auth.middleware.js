const { verifyToken } = require('../utils/tokenGenerator');
const User = require('../models/user.model.js');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No token provided. Authorization denied.' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Find user and attach to request
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ 
                message: 'User not found. Authorization denied.' 
            });
        }

        // Check user account status
        if (user.status !== 'active') {
            return res.status(403).json({ 
                message: 'Account is not active. Please contact support.' 
            });
        }

        // Attach user to request object
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please log in again.' 
            });
        }

        res.status(401).json({ 
            message: 'Invalid token. Authorization denied.',
            error: error.message 
        });
    }
};

module.exports = authMiddleware;