var express = require('express');
var path = require('path');
var createError = require('http-errors');
const {engine} = require('express-handlebars');

var app = express();

// Setting up a static folder
const publicDirectoryPath = path.join(__dirname, '/public');
app.use(express.static(publicDirectoryPath));

module.exports = app;
