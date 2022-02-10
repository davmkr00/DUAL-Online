const express = require('express')
const path = require('path');

app = express()



app.use(express.static(path.join(__dirname, '../game', 'menu')));
app.use(express.static(path.join(__dirname, '../game', 'img')));
app.use('/game/:id', express.static(path.join(__dirname, '../game', 'game')));
app.use('/game/:id', express.static(path.join(__dirname, '../game', 'img')));





module.exports = app