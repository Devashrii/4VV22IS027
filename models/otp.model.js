const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: [true, 'OTP is required']
    },
    purpose: {
        type: String,
        enum: ['registration', 'password_reset', 'account_verification'],
        required: [true, 'Purpose is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes
    },
    attempts: {
        type: Number,
        default: 0,
        max: [3, 'Maximum OTP verification attempts exceeded']
    }
});

OTPSchema.methods.incrementAttempts = function() {
    this.attempts += 1;
    return this.save();
};

OTPSchema.methods.resetAttempts = function() {
    this.attempts = 0;
    return this.save();
};

module.exports = mongoose.model('OTP', OTPSchema);