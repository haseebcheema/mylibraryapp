
const express = require('express');
const app = express();
const PORT_NUM = 3000;

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const ejsLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')

app.use(express.urlencoded( { extended:true } ));
app.use(ejsLayouts);
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/authors', authorRouter);

const mongoose = require('mongoose');
const { error } = require('console');
mongoose.connect(process.env.DATABASE_URL, {
    useNewURLParser: true
});

const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error);
})
db.once('open', () => {
    console.log('connected to database');
})

app.listen(process.env.PORT || PORT_NUM, () => {
    console.log('server is running');
});