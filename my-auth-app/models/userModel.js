import pool from '../config/database.js';

const createUser = async (username, email, password) => {
	const [result] = await pool.query(
		'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
		[username, email, password]
	);
	return { id: result.insertId, username, email };
};

const findUserByEmail = async (email) => {
	const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
	return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    return rows[0];
};

export {createUser, findUserByEmail, findUserById};