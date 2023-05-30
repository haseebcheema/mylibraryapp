const express = require('express');
const router = express.Router();

// get all authors
router.get('/', (req, res) => {
    res.render('authors/index');
});

// get form where new author is created
router.get('/new', (req, res) => {
    res.render('authors/new');
});

// to create a new author
router.post('/', (req, res) => {
    res.send('new author is created');
});

module.exports = router;