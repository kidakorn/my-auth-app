import { findUserById } from '../models/userModel.js';

const getUserProfile = async (req, res) => {
    try {
        // req.userId ได้มาจาก authMiddleware.js
        const user = await findUserById(req.userId);

        if (user) {
            // ส่งข้อมูลผู้ใช้กลับไปตามที่คุณต้องการ
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                // ไม่ส่ง password กลับไป
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // ควรส่ง error 500 กลับไปหากมีปัญหาด้านเซิร์ฟเวอร์
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};

export { getUserProfile }; // ใช้ Named Export