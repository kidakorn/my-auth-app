import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'

const { json } = bodyParser; 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // กำหนด Base Route เป็น /api/users

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});