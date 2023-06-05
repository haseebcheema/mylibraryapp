const express = require('express');
const router = express.Router();

const Book = require('../model/book');
const Author = require('../model/author');
const { default: mongoose, ConnectionStates } = require('mongoose');

// const fs = require('fs');

// code for image file
// const multer = require('multer');
// const path = require('path');
// const uploadPath = path.join('public', Book.coverImageBasePath);

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype));
//     }
// });

// get all books
router.get('/', async (req, res) => {

    let query = Book.find();
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter);
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
router.post('/', async (req, res) => {   // upload.single('coverImageName')
    // const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
        // coverImageName: fileName
    }); 

    saveCover(book, req.body.coverImageName);

    try {
        const newBook = await book.save();
        res.redirect(`/books${newBook.id}`);
    } catch (error) {
        // if(book.coverImageName != null){
        //     removeBookCover(book.coverImageName);
        // }
        renderNewPage(res, book, true);
    }
});

// show book route
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', { book: book });
    } catch {
        res.redirect('/');
    }
});

// edit book route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    } catch {
        res.redirect('/');
    }
});

// update book route
router.put('/:id', async (req, res) => {   // upload.single('coverImageName')
    let book;
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author.trim();
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if (req.body.coverImage != null && req.body.coverImage !== ''){
            saveCover(book, req.body.coverImage);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch (error) {
        if(book != null){
            renderEditPage(res, book, true);
        } else{
            res.redirect('/');
        }
    }
});

// delete book route
router.delete('/:id', async (req, res) => {
    try {
      // Retrieve the book by ID and delete it
      const book = await Book.findByIdAndDelete(req.params.id);
  
      // Handle successful deletion
      res.redirect('/books'); // Redirect to a specific page after deletion
    } catch (error) {
      // Handle any errors that occur during deletion
      res.redirect(`/books/${req.params.id}`); // Redirect to a specific page indicating an error
    }
  });
  

// render new page function
async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError);
}

// render edit page function
async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError);
}

// render form page function
async function renderFormPage(res, book, form, hasError = false){
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error updating book';
            } else{
                params.errorMessage = 'Error creating book';
            }
        }
        res.render(`books/${form}`, params);
    } catch (error) {
        res.redirect('/books');
    }
}

// function for removing book covers if error occurs
// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err);
//     })
// }

// function for savng cover image to database
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    } 
}

module.exports = router;