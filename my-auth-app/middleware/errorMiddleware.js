const errorHandler = (err, req, res, next) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;

	if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'Username or email already exists.';
    }

	res.status(statusCode).json({
		message: message,
		stack: process.env.NODE_ENV === 'prodution' ? null : err.stack,
	});
};

export { errorHandler };