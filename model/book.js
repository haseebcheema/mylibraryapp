const mongoose = require('mongoose');
const path = require('path');
const coverImageBasePath = 'uploads/bookCovers';

// schema for the books
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
});

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName){
        return path.join('/', coverImageBasePath, this.coverImageName);
    }
});

// create the Book model
module.exports = mongoose.model('Book', bookSchema);

module.exports.coverImageBasePath = coverImageBasePath;