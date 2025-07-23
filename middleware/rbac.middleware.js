const User = require('../models/User');
const Role = require('../models/Role');

/**
 * RBAC Middleware for permission checking
 * @param {string} resource - Resource to check permissions for
 * @param {string} action - Action to perform on resource
 * @returns {Function} - Express middleware function
 */
const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            // Get user from auth middleware
            const userId = req.user.id;

            // Find user with populated role
            const user = await User.findById(userId).populate('role');

            if (!user || !user.role) {
                return res.status(403).json({ 
                    message: 'Access denied: No role assigned' 
                });
            }

            // Check role permissions
            const hasPermission = user.role.permissions.some(perm => 
                (perm.resource === resource || perm.resource === 'all') && 
                perm.actions.includes(action)
            );

            if (hasPermission) {
                return next();
            }

            return res.status(403).json({ 
                message: 'Access denied: Insufficient permissions' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Permission check error', 
                error: error.message 
            });
        }
    };
};

module.exports = {
    checkPermission
};