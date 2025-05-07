"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const booksRoutes_1 = __importDefault(require("./routes/booksRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Database connection
mongoose_1.default.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/books', booksRoutes_1.default);
const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};
startServer();
