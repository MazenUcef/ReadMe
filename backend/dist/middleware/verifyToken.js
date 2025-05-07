"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "No authentication token, access denied" });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user (exclude password)
        const user = await UserModel_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error during authentication" });
        return;
    }
};
exports.verifyToken = verifyToken;
