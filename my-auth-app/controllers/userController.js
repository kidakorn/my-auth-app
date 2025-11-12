import asyncHandler from 'express-async-handler';
import { findUserById, findAllUsers, updateUserRoleById, deleteUserById, createUser, updateUserProfileById } from '../models/userModel.js';
import { hashPassword } from '../utils/passwordHash.js';

const getUserProfile = asyncHandler(async (req, res) => {
    // req.userId ได้มาจาก authMiddleware.js
    const user = await findUserById(req.user.id);

    if (user) {
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404); // ตั้งค่า Status
        throw new Error('User not found'); // โยน Error
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await findAllUsers();
    res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID ของ user ที่จะแก้
    const { role } = req.body; // Role ใหม่ที่ส่งมา

    if (!role || (role !== 'admin' && role !== 'user')) {
        res.status(400);
        throw new Error('Invalid role. Must be "admin" or "user".');
    }

    const affectedRows = await updateUserRoleById(id, role);
    if (affectedRows === 0) {
        res.status(404);
        throw new Error('User not found.');
    }
    res.json({ message: 'User role updated successfully' });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    if (parseInt(id, 10) === adminId) {
        res.status(400);
        throw new Error('Admin cannot delete their own account.');
    }

    const affectedRows = await deleteUserById(id);
    if (affectedRows === 0) {
        res.status(404);
        throw new Error('User not found.');
    }
    res.json({ message: 'User deleted successfully' });
});

const createUserByAdmin = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        res.status(400);
        throw new Error('All fields (username, email, password, role) are required.');
    }

    if (role !== 'admin' && role !== 'user') {
        res.status(400);
        throw new Error('Invalid role. Must be "admin" or "user".');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(username, email, hashedPassword, role);

    res.status(201).json({ message: 'User created successfully by admin', user: newUser });
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username || !email) {
        res.status(400);
        throw new Error('Username and email are required.');
    }

    const affectedRows = await updateUserProfileById(userId, username, email);

    if (affectedRows === 0) {
        res.status(404);
        throw new Error('User not found');
    }

    const updatedUser = {
        id: userId,
        username: username,
        email: email,
        role: req.user.role
    };

    res.json({ message: 'Profile updated successfully', user: updatedUser });
});

export { getUserProfile, getAllUsers, updateUserRole, deleteUser, createUserByAdmin, updateUserProfile }; // ใช้ Named Export