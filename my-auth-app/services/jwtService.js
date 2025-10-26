import jwt from 'jsonwebtoken';

const createToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return null;
	}
};

export { createToken, verifyToken };