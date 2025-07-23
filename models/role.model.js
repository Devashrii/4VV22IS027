const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        unique: true,
        enum: ['ADMIN', 'USER', 'MANAGER', 'GUEST']
    },
    permissions: [{
        resource: {
            type: String,
            required: true
        },
        actions: [{
            type: String,
            enum: ['read', 'write', 'delete', 'update']
        }]
    }]
}, {
    timestamps: true
});

// Static method to get default roles
RoleSchema.statics.getDefaultRoles = async function() {
    const roles = await this.find({});
    if (roles.length === 0) {
        // Create default roles if not exists
        await this.create([
            {
                name: 'ADMIN',
                permissions: [
                    {
                        resource: 'all',
                        actions: ['read', 'write', 'update', 'delete']
                    }
                ]
            },
            {
                name: 'USER',
                permissions: [
                    {
                        resource: 'profile',
                        actions: ['read', 'update']
                    }
                ]
            },
            {
                name: 'MANAGER',
                permissions: [
                    {
                        resource: 'team',
                        actions: ['read', 'update']
                    }
                ]
            },
            {
                name: 'GUEST',
                permissions: [
                    {
                        resource: 'public',
                        actions: ['read']
                    }
                ]
            }
        ]);
    }
    return roles;
};

module.exports = mongoose.model('Role', RoleSchema);