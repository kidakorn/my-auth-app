import pool from '../config/database.js';

const createUser = async (username, email, password, role = 'user') => {
	const [result] = await pool.query(
		'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
		[username, email, password, role]
	);
	return { id: result.insertId, username, email, role };
};

const findUserByUsername = async (username) => {
	const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
	return rows[0];
};

const findUserById = async (id) => {
	const [rows] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
	return rows[0];
};

const findAllUsers = async () => {
	const [rows] = await pool.query('SELECT id, username, email, role FROM users');
	return rows;
};

const updateUserRoleById = async (id, role) => {
	const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
	return result.affectedRows; // คืนค่า 1 ถ้าสำเร็จ
};

const deleteUserById = async (id) => {
	const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
	return result.affectedRows;
};

const updateUserProfileById = async (id, username, email) => {
	const [result] = await pool.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
	return result.affectedRows;
};

// (ฟังก์ชันนี้จำเป็นสำหรับ 'Forgot Password')
const findUserByEmail = async (email) => {
	const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
	return rows[0];
};

// (ฟังก์ชันนี้สำหรับบันทึก Reset Token)
const saveResetToken = async (id, token, expires) => {
	const [result] = await pool.query(
		'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, id]
	);
	return result.affectedRows;
};

// ค้นหาผู้ใช้ด้วย Hashed Token (และตรวจสอบว่ายังไม่หมดอายุ)
const findUserByResetToken = async (hashedToken) => {
	const [rows] = await pool.query(
		'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', [hashedToken, new Date(Date.now())]
	);
	return rows[0];
};

// อัปเดตรหัสผ่าน (และล้าง Reset Token)
const updatePasswordAndClearToken = async (id, hashedPassword) => {
	const [result] = await pool.query(
		'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
		[hashedPassword, id]
	);
	return result.affectedRows;
};

export {
	createUser, findUserByUsername, findUserById, findAllUsers, updateUserRoleById, deleteUserById, updateUserProfileById,
	findUserByEmail, saveResetToken, findUserByResetToken, updatePasswordAndClearToken
};