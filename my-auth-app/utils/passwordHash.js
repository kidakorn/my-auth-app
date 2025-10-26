import { genSalt, hash, compare } from 'bcryptjs';

const hashPassword = async (password) => {
	const salt = await genSalt(10);
	const hashedPassword = await hash(password, salt);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	return await compare(password, hashedPassword);
};

export { hashPassword, comparePassword }