"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};
const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password should be at least 6 characters long" });
            return;
        }
        if (username.length < 3) {
            res.status(400).json({ message: "Username should be at least 3 characters long" });
            return;
        }
        // Check for existing user
        const existingUser = await UserModel_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            res.status(409).json({
                success: false,
                message: `User with this ${field} already exists`
            });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = new UserModel_1.default({
            email,
            username,
            password: hashedPassword,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
        });
        await user.save();
        const token = generateToken(user._id.toString());
        const { password: pass, ...rest } = user.toObject();
        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: rest,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = await UserModel_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials, User not found" });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials, Wrong password" });
            return;
        }
        const token = generateToken(user._id.toString());
        const { password: pass, ...rest } = user.toObject();
        res.status(200).json({
            success: true,
            message: "User created Successfully",
            data: rest,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.default = {
    register,
    login
};
