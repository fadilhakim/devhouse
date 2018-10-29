require('dotenv').config()

const express = require('express')
const http = require('http');
const routes = require('./routes/routes.js')
const app = express()
const nodemailer = require('nodemailer');

const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const i18n=require("i18n-express");

const flash = require('express-flash-messages')

app.use(flash())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n({
  translationsPath:(__dirname + '/lang'), 
  siteLangs: ["en","id"],
  textsVarName: 'translation',
  defaultLang : "en",
  browserEnable : false
}));

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

app.use(express.static(__dirname + '/public'));
app.use(helmet(), compression(), cookieParser());


app.get('/maintenance', (req, res) => res.render('maintenance'))
app.get('/test', (req, res) => res.render('contact-success'))
app.get('/', (req, res) => res.render('home'))
app.get('/why-us', (req, res) => res.render('why-us'))

app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: process.env.GMAIL_USER,
    subject: 'New message from potential client',
    html: `<strong>Client Name :</strong> ${req.body.name} </br> <strong>Client Email :</strong> ${req.body.email} </br> <strong>Service Needs :</strong> ${req.body.category} </br> <strong>Time to Meetup :</strong> ${req.body.date} </br> <strong>The Detail :</strong> ${req.body.detail}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      res.render('contact-success')
    }
    else {
      res.render('contact-success')
    }
  });
});

routes(app);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log('Example app listening on port 3002!'))