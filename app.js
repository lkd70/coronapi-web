'use strict';

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

module.exports = app;
