var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { use } = require('./routes/index');

const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

var app = express();

MongoClient.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(client => {
        const db = client.db(config.dbName);
        const collection = db.collection(config.dbCollection);
        app.locals[config.dbCollection] = collection;
    })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req, res, next) => {
    const collection = req.app.locals[config.dbCollection];
    req.collection = collection;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
