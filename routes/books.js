const express = require('express');
const router = express.Router();

const Book = require('../model/book');
const Author = require('../model/author');
const { default: mongoose } = require('mongoose');

const fs = require('fs');

// code for image file
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// get all books
router.get('/', (req, res) => {
    res.send('ALL BOOKS');
});

// get form where new book is created
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

// to create a new book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    }); 

    try {
        const newBook = await book.save();
        res.redirect('books');
    } catch (error) {
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
});

// render new page function
async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }

        if(hasError) params.errorMessage = 'Error creating book';

        const book = new Book();
        res.render('books/new', params);
    } catch (error) {
        res.redirect('/books');
    }
}

// function for removing book covers if error occurs
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    })
}

module.exports = router;