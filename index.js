require('dotenv').config()

const express = require('express')
const http = require('http');
const routes = require('./routes/routes.js')
const app = express()

const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

app.use(express.static(__dirname + '/public'));
app.use(helmet(), compression(), cookieParser());


app.get('/', (req, res) => res.render('home'))
app.get('/why-us', (req, res) => res.render('why-us'))

routes(app);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log('Example app listening on port 3002!'))