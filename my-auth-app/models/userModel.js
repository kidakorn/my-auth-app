import pool from '../config/database.js';

const createUser = async (username, email, password, role = 'user') => {
	const [result] = await pool.query(
		'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
		[username, email, password, role]
	);
	return { id: result.insertId, username, email, role };
};

const findUserByUsername = async (username) => {
	const [rows] = 	await pool.query('SELECT * FROM users WHERE username = ?', [username]);
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

export {createUser, findUserByUsername, findUserById, findAllUsers, updateUserRoleById, deleteUserById};