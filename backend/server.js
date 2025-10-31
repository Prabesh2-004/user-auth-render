import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userAuth from './routes/user.routes.js'

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userAuth)

connectDB();

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
