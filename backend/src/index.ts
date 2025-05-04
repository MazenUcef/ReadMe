import express from "express";
import 'dotenv/config'
import authRoutes from './routes/authRoutes'
import booksRoutes from './routes/booksRoutes'
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';

const app = express()
app.use(express.json())
app.use(cors())
// Database connection
mongoose.set('strictQuery', false);

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use('/api/auth', authRoutes)
app.use('/api/books', booksRoutes)


const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

startServer();