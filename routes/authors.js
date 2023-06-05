const express = require('express');
const router = express.Router();

const Author = require('../model/author');
const Book = require('../model/book');
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
        res.redirect(`/authors/${author.id}`);
    } catch (err) {
        res.render('authors/new', {
            author: req.body,
            errorMessage: 'Error creating Author'
        });
    }    
});

// authors show/edit/update/delete routes

// show
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
          author: author,
          booksByAuthor: books
        });
      } catch {
        res.redirect('/');
      }
});

// edit
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch (error) {
        res.redirect('/authors');
    } 
});

// update
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch (err) {
        if(author == null){
            res.redirect('/');
        }
        else{
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            });
        }
    }  
});

// delete
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.deleteOne();
        res.redirect('/authors');
    } catch (error) {
        if(author == null){
            res.redirect('/');
        }
        else{
            res.redirect(`/authors/${author.id}`)
        }
    } 
});


module.exports = router;