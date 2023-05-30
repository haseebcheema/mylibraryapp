const mongoose = require('mongoose');

// schema for the author
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// create the Author model
module.exports = mongoose.model('Author', authorSchema);