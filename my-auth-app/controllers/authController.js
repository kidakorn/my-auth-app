import { createUser, findUserByEmail, findUserByUsername, saveResetToken, findUserByResetToken, updatePasswordAndClearToken } from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/passwordHash.js';
import { createToken } from '../services/jwtService.js';
import crypto from 'crypto';
import sendEmail from './../utils/sendEmail.js';

const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const hashedPassword = await hashPassword(password);
		const newUser = await createUser(username, email, hashedPassword);
		res.status(201).json({ message: 'User registered successfull', user: newUser });
	} catch (error) {
		res.status(500).json({ message: 'Error registering user', error: error.message });
	}
};

const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await findUserByUsername(username);
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await comparePassword(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = createToken({
			id: user.id,
			username: user.username,
			role: user.role
		});
		res.json({ message: 'Login successful', token });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error: error.message });
	}
};

// forgotPassword 
const forgotPassword = async (req, res) => {
	// 1. ค้นหาผู้ใช้ด้วยอีเมล
	const { email } = req.body;

	try {
		const user = await findUserByEmail(email);
		// ห้ามตอบว่า "User not found" ให้ตอบว่า "Email sent" เสมอ แม้ว่าจะไม่เจอผู้ใช้ เพื่อป้องกันการดักเดาอีเมล (Email Enumeration Attack)
		if (!user) {
			return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
		}
		// 2. สร้าง Reset Token (แบบดิบ ที่จะส่งไปในอีเมล)
		const resetToken = crypto.randomBytes(32).toString('hex');

		// 3. **(สำคัญมาก)** Hash Token นี้ก่อนบันทึกลง DB
		// เราไม่เก็บ Token ดิบๆ ลง DB (เหมือนรหัสผ่าน)
		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

		// 4. ตั้งเวลาหมดอายุ (เช่น 15 นาที)
		const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 นาที

		// 5. บันทึก Hashed Token และเวลาหมดอายุลง DB
		await saveResetToken(user.id, hashedToken, tokenExpires);

		// 6. สร้าง URL ที่จะส่งไปในอีเมล (ต้องชี้ไปที่ Frontend)
		const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

		// 7. สร้างข้อความอีเมล
		const message = `
			<h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the link below to reset your password.</p>
            <a href="${resetURL}" target="_blank">Reset Your Password</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
		`;

		// 8. ส่งอีเมล
		await sendEmail({
			email: user.email,
			subject: 'Password Reset Request',
			html: message,
		});

		// 9. ส่ง Response
		res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
	} catch (error) {
		// ถ้าล่มจริงๆ (เช่น DB พัง) ให้ล้าง Token เพื่อความปลอดภัย
		// (เรายังไม่ได้สร้างฟังก์ชัน clearResetToken แต่ไม่เป็นไร)
		console.error('FORGOT_PASSWORD_ERROR', error);
		// ห้ามส่ง Error จริงกลับไป
		res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
	}
};

const resetPassword = async (req, res) => {
    // 1. รับ Token "ดิบ" จาก URL params
    const { token } = req.params;
    
    // 2. รับรหัสผ่านใหม่จาก body
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }

    try {
        // 3. Hash Token ดิบที่ได้จาก URL 
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 4. ค้นหาผู้ใช้ด้วย Hashed Token
        const user = await findUserByResetToken(hashedToken);

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // 5. Hash รหัสผ่านใหม่ (ด้วย bcrypt)
        const newHashedPassword = await hashPassword(password);

        // 6. อัปเดตรหัสผ่านใหม่ใน DB และล้าง Token
        await updatePasswordAndClearToken(user.id, newHashedPassword);

        res.json({ message: 'Password has been reset successfully. Please log in.' });

    } catch (error) {
        console.error('RESET_PASSWORD_ERROR:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

export { register, login, forgotPassword, resetPassword };