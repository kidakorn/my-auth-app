import { verifyToken } from '../services/jwtService.js';

const protect  = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json
			({ message: 'Authentication required' });
	}

	const token = authHeader.split(' ')[1]; 
	if (!token) {
		return res.status(401).json
			({ message: 'Token not provided' });
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return res.status(401).json
			({ message: 'Invalid or expired token' });
	}

	req.userId = decoded.id; 
	next();
};

export { protect };