const express = require('express');
const router = express.Router();

const Book = require('../model/book');
const Author = require('../model/author');
const { default: mongoose, ConnectionStates } = require('mongoose');

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
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch(err){
        res.redirect('/');
    }
});

// get form where new book is created
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

// to create a new book
router.post('/', upload.single('coverImageName'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    }); 

    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (error) {
        console.log(error)
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
        };
        if (hasError) params.errorMessage = 'Error creating book';
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