const express = require('express');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
// Initializations
const app = express();
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false})); //Transformara los datos recibidos en JSON,true= acepta objetos
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})
//Routes
app.get('/',(req,res)=>{
    res.render('./index');
});
app.use(require('./routes/monitorization.routes'));
app.use(express.static(path.join(__dirname, '/public')));

//Static files --Archivos que el navegador puede pedir directamente.
app.use(express.static(path.join(__dirname,'public'))); //Le dice donde esta la carpeta public

module.exports = app; //Para poder usarlo en index.js
