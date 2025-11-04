import { createUser, findUserByUsername } from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/passwordHash.js';
import { createToken } from '../services/jwtService.js';

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
			role:user.role 
		});
		res.json({ message: 'Login successful', token });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error: error.message });
	}
};

export { register, login };