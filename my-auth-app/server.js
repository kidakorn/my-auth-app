import 'dotenv/config';
import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// const { json } = bodyParser; 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

// app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});