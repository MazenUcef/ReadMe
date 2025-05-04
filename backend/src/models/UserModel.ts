import mongoose, { Document, Model } from "mongoose";

// Interface for the User document (instance methods)
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage: string;
}

// // Interface for the User model (static methods)
// export interface IUserModel extends Model<IUser> {
//     // You can add static methods here if needed
//     // Example: findByEmail(email: string): Promise<IUser>;
// }

// User Schema
const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: ""
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);
export default User;