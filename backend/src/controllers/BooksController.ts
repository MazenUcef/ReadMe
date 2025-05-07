import { CountDocumentsOptions } from './../../node_modules/mongodb/src/collection';
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';
import Book from "../models/BookModel";




const addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, caption, rating, image } = req.body
        if (!image || !title || !caption || !rating) {
            res.status(400).json({ message: "Please Provide all fields" })
            return
        }

        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user?._id
        })

        await newBook.save()

        res.status(201).json(newBook)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" })
    }
}


const getRecommendedBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find({user:req.user?._id}).sort({ createdAt: -1 })
        res.json(books)
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Internal Server error" })
    }
}
const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const skip = (page - 1) * limit
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage")


        const totalBooks = await Book.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Internal Server error" })
    }
}
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            res.status(404).json({ message: "Book Not Found" })
            return
        }

        if (!req.user?._id || book.user.toString() !== req.user._id.toString()) {
            
            res.status(401).json({ message: "Unauthorized" })
            return
        }

        if (book.image && book.image.includes("cloudinary")) {
            try {
                const parts = book.image.split("/");
                const lastPart = parts[parts.length - 1];
                const publicId = lastPart?.split(".")[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (error) {
                console.log(error);
            }
        }

        await book.deleteOne()
        res.json({ message: "Book Deleted Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" })
    }
}


export default {
    getRecommendedBooks,
    getBooks,
    addBook,
    deleteBook
}