const User = require('../models/user.model.js');
const OTP = require('../models/otp.model.js');
const Role = require('../models/role.model.js');
const { 
    generateToken, 
    generateOTP, 
    generatePasswordResetToken 
} = require('../utils/tokenGenerator');
const { sendEmail } = require('../utils/nodemailer');
const crypto = require('crypto');

class AuthController {
    /**
     * User Registration
     * @route POST /api/auth/register
     */
    generateAccessToken = async () => {
  const authApiUrl = "http://20.244.56.144/shortURL/auth";
  const credentials = {
    companyName: "Short URL",
    clientID: "86a21584-c81a-4f66-aa37-5b1058c353e1",
    ownerName: "DEVASHRI",
    ownerEmail: "devashridhaware@gmail.com",
    rollNo: "4VV22IS027",
    clientSecret: "CNKgcgXZZhRavnpR",
  }};
    static async register(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            // Check if user already exists
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'User already exists with this email' 
                });
            }

            // Find or create default role
            let userRole = role;
            if (!role) {
                const defaultRole = await Role.findOne({ name: 'USER' });
                userRole = defaultRole._id;
            }

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password,
                role: userRole,
                status: 'inactive'
            });

            // Generate OTP for verification
            const otp = generateOTP();
            await OTP.create({
                email,
                otp,
                purpose: 'registration'
            });

            // Send verification email
            await sendEmail(email, 'Verify Your Account', 'otp', { otp });

            // Save user
            await newUser.save();

            res.status(201).json({ 
                message: 'User registered successfully. Please verify your email.' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Registration failed', 
                error: error.message 
            });
        }
    }

    /**
     * Email Verification with OTP
     * @route POST /api/auth/verify-email
     */
    static async verifyEmail(req, res) {
        try {
            const { email, otp } = req.body;

            // Find OTP
            const otpRecord = await OTP.findOne({ 
                email, 
                otp, 
                purpose: 'registration' 
            });

            if (!otpRecord) {
                return res.status(400).json({ 
                    message: 'Invalid or expired OTP' 
                });
            }

            // Update user status
            await User.findOneAndUpdate(
                { email }, 
                { 
                    isVerified: true, 
                    status: 'active' 
                }
            );

            // Remove OTP record
            await OTP.deleteOne({ _id: otpRecord._id });

            res.status(200).json({ 
                message: 'Email verified successfully' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Verification failed', 
                error: error.message 
            });
        }
    }

    /**
     * User Login
     * @route POST /api/auth/login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user and select password for comparison
            const user = await User.findOne({ email }).select('+password').populate('role');

            if (!user) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Check account status
            if (user.status !== 'active') {
                return res.status(403).json({ 
                    message: 'Account is not active' 
                });
            }

            // Generate JWT
            const token = generateToken({ 
                id: user._id, 
                email: user.email,
                role: user.role.name
            });

            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            res.status(200).json({ 
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role.name
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Login failed', 
                error: error.message 
            });
        }
    }

    /**
     * Forgot Password
     * @route POST /api/auth/forgot-password
     */
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Find user
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ 
                    message: 'No account found with this email' 
                });
            }

            // Generate password reset token
            const resetToken = user.createPasswordResetToken();
            await user.save();

            // Create reset link
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            // Send password reset email
            await sendEmail(email, 'Password Reset Request', 'password_reset', { resetLink });

            res.status(200).json({ 
                message: 'Password reset link sent to your email' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Password reset failed', 
                error: error.message 
            });
        }
    }

    /**
     * Reset Password
     * @route POST /api/auth/reset-password
     */
    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            // Hash the token for comparison
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            // Find user with valid reset token
            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ 
                    message: 'Invalid or expired reset token' 
                });
            }

            // Set new password
            user.password = newPassword;
            user.passwordResetToken = null;
            user.passwordResetExpires = null;

            await user.save();

            res.status(200).json({ 
                message: 'Password reset successful' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Password reset failed', 
                error: error.message 
            });
        }
    }

    /**
     * Logout (Invalidate Token)
     * @route POST /api/auth/logout
     */
    static async logout(req, res) {
        try {
            // In a stateless JWT system, logout is typically handled client-side
            // by removing the token. However, we can add additional logic if needed.
            res.status(200).json({ 
                message: 'Logout successful' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Logout failed', 
                error: error.message 
            });
        }
    }
}
router.get("/", async function (req, res, next) {
  if (!authToken || Math.floor(Date.now() / 1000) >= tokenExpirationTime) {
   
    await generateAccessToken();
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    const sortedTrains = sortTrains(response.data);
    res.json(sortedTrains);
  } catch (error) {
    console.error("Error fetching train data:", error);
    res.status(500).json({ error: "Error fetching train data" });
  }
});

module.exports = router;

module.exports = AuthController;