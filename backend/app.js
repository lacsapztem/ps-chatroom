var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { log } = require('console');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"..", "frontend", "build")));

app.get('/test', (req, res) => 
    res.send('Hello, World!')
)

module.exports = app;
console.log("départ")
