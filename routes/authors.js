const express = require('express');
const router = express.Router();

const Author = require('../model/author');
const { default: mongoose } = require('mongoose');

// get all authors
router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query 
        });
    } catch(err){
        res.render('/');
    }
});

// get form where new author is created
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// to create a new author
router.post('/', async (req, res) => {
    try {
        const author = new Author({
            name: req.body.name
        });
        const newAuthor = await author.save();
        res.redirect('/authors');
    } catch (err) {
        res.render('authors/new', {
            author: req.body,
            errorMessage: 'Error creating Author'
        });
    }    
});


module.exports = router;