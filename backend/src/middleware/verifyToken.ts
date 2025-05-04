import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/UserModel";


declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ message: "No authentication token, access denied" });
            return
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Find user (exclude password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
            return
        }
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error during authentication" });
        return
    }
};