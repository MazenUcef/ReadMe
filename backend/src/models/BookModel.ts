import mongoose, { Document } from "mongoose";

// Interface for the User document (instance methods)
export interface IBook extends Document {
    title: string;
    caption: string;
    image: string;
    rating: string;
    user: mongoose.Types.ObjectId;
}

// // Interface for the User model (static methods)
// export interface IUserModel extends Model<IUser> {
//     // You can add static methods here if needed
//     // Example: findByEmail(email: string): Promise<IUser>;
// }

// User Schema
const bookSchema = new mongoose.Schema<IBook>({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book;