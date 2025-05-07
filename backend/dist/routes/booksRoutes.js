"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BooksController_1 = __importDefault(require("../controllers/BooksController"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.get('/getRecommendedBooks', verifyToken_1.verifyToken, BooksController_1.default.getRecommendedBooks);
router.get('/getBooks', verifyToken_1.verifyToken, BooksController_1.default.getBooks);
router.post('/add', verifyToken_1.verifyToken, BooksController_1.default.addBook);
router.delete('/delete/:id', BooksController_1.default.deleteBook);
exports.default = router;
