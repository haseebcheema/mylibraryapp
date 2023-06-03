const mongoose = require('mongoose');
const Book = require('./book');

// schema for the author
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('deleteOne', function(next){
    Book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err);
        }
        else if( books.length > 0){
            next(new Error('This author has books still'));
        }
        else{
            next();
        }
    });
});

// create the Author model
module.exports = mongoose.model('Author', authorSchema);