"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// // Interface for the User model (static methods)
// export interface IUserModel extends Model<IUser> {
//     // You can add static methods here if needed
//     // Example: findByEmail(email: string): Promise<IUser>;
// }
// User Schema
const bookSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
const Book = mongoose_1.default.model("Book", bookSchema);
exports.default = Book;
