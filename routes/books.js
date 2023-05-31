const express = require('express');
const router = express.Router();

const Book = require('../model/book');
const Author = require('../model/author');
const { default: mongoose } = require('mongoose');

// get all books
router.get('/', (req, res) => {
    res.send('ALL BOOKS');
});

// get form where new book is created
router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({});
        const book = new Book();
        res.render('books/new', {
            authors: authors,
            book: book 
    });
    } catch (error) {
        res.redirect('/books');
    }
});

// to create a new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    }); 
});

module.exports = router;