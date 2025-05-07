"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const BookModel_1 = __importDefault(require("../models/BookModel"));
const addBook = async (req, res, next) => {
    try {
        const { title, caption, rating, image } = req.body;
        if (!image || !title || !caption || !rating) {
            res.status(400).json({ message: "Please Provide all fields" });
            return;
        }
        const uploadResponse = await cloudinary_1.v2.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        const newBook = new BookModel_1.default({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user?._id
        });
        await newBook.save();
        res.status(201).json(newBook);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
const getRecommendedBooks = async (req, res, next) => {
    try {
        const books = await BookModel_1.default.find({ user: req.user?._id }).sort({ createdAt: -1 });
        res.json(books);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
const getBooks = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const books = await BookModel_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");
        const totalBooks = await BookModel_1.default.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
const deleteBook = async (req, res, next) => {
    try {
        const book = await BookModel_1.default.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Book Not Found" });
            return;
        }
        if (book.user.toString() !== req.user?._id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const parts = book.image.split("/");
                const lastPart = parts[parts.length - 1];
                const publicId = lastPart?.split(".")[0];
                if (publicId) {
                    await cloudinary_1.v2.uploader.destroy(publicId);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        await book.deleteOne();
        res.json({ message: "Book Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
exports.default = {
    getRecommendedBooks,
    getBooks,
    addBook,
    deleteBook
};
