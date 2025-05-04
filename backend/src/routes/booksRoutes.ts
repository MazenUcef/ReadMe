import express from 'express'
import BooksController from '../controllers/BooksController'
import { verifyToken } from '../middleware/verifyToken'


const router = express.Router()


router.get('/getRecommendedBooks', verifyToken, BooksController.getRecommendedBooks)
router.get('/getBooks', verifyToken, BooksController.getBooks)
router.post('/add', verifyToken, BooksController.addBook)
router.delete('/delete/:id', BooksController.deleteBook)


export default router