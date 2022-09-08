const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

//definimos nueva estrategia para autenticar
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
},async (name, password, done) => {
    //Comprobamos si existe user
    const user = await User.findOne({name})
    if (!user){
        return done(null, false, {message: 'Not User Found'});
    }else {
        //Comprbamos password
        const match = await user.matchPassword(password);
        if (match){
            return done(null, user);
        }else {
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));

//Guarda en el servidor una vez el usuario se ha logeado
passport.serializeUser((user,done) => {
    done(null, user.id);
});

//A medida q navega usuario comprueba si existe el user
passport.deserializeUser((id,done) => {
    User.findById(id, (err,user) => {
        done(err,user);
    })
});
