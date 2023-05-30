const express = require('express');
const router = express.Router();

const Author = require('../model/author');

// get all authors
router.get('/', (req, res) => {
    res.render('authors/index');
});

// get form where new author is created
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// to create a new author
router.post('/', (req, res) => {
    res.send('new author is created');
});

module.exports = router;