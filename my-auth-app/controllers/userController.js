import { findUserById , findAllUsers} from '../models/userModel.js';

const getUserProfile = async (req, res) => {
    try {
        // req.userId ได้มาจาก authMiddleware.js
        const user = await findUserById(req.user.id);

        if (user) {
            // ส่งข้อมูลผู้ใช้กลับไปตามที่คุณต้องการ
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
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

const getAlluser = async (req, res) => {
    try {
        const users = await findAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ massage: 'Server error fetching users', error: error.message });
    }
};

export { getUserProfile, getAlluser }; // ใช้ Named Export