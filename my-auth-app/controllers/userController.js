import { findUserById, findAllUsers, updateUserRoleById, deleteUserById, createUser, updateUserProfileById } from '../models/userModel.js';
import { hashPassword } from '../utils/passwordHash.js';

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

const getAllUsers = async (req, res) => {
    try {
        const users = await findAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users', error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params; // ID ของ user ที่จะแก้
    const { role } = req.body; // Role ใหม่ที่ส่งมา

    if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(400).json({ message: 'Invalid role. Must be "admin" or "user".' });
    }

    try {
        const affectedRows = await updateUserRoleById(id, role);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    if (parseInt(id, 10) === adminId) {
        return res.status(400).json({ message: 'Admin cannot delete their own account.' });
    }

    try {
        const affectedRows = await deleteUserById(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
};

const createUserByAdmin = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields (username, email, password, role) are required.' });
    }
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Invalid role. Must be "admin" or "user".' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser(username, email, hashedPassword, role);

        res.status(201).json({ message: 'User created successfully by admin', user: newUser });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error creating user', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        const affectedRows = await updateUserProfileById(userId, username, email);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = {
            id: userId,
            username: username,
            email: email,
            role: req.user.role
        };
        res.json({ message: 'Profile updeted successfully', user: updatedUser });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username or email already in use.' });
        }
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

export { getUserProfile, getAllUsers, updateUserRole, deleteUser, createUserByAdmin, updateUserProfile }; // ใช้ Named Export