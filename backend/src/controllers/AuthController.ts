import { NextFunction, Request, Response } from "express";
import User from "../models/UserModel";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "15d" })
}


const register = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const { email, username, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" })
            return
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password should be at least 6 characters long" })
            return;
        }

        if (username.length < 3) {
            res.status(400).json({ message: "Username should be at least 3 characters long" })
            return;
        }


        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            res.status(409).json({ // 409 Conflict is more appropriate for duplicate resources
                success: false,
                message: `User with this ${field} already exists`
            });
            return
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user
        const user = new User({
            email,
            username,
            password: hashedPassword,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
        });
        await user.save();
        const token = generateToken((user._id as string).toString());
        const { password: pass, ...rest } = user.toObject();
        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: rest,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}



const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" })
            return
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            res.status(401).json({ message: "Invalid credentials, User not found" });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials, Wrong password" });
            return
        }
        const token = generateToken((user._id as string).toString());

        const { password: pass, ...rest } = user.toObject();
        res.status(200).json({
            success: true,
            message: "User created Successfully",
            data: rest,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}


export default {
    register,
    login
}