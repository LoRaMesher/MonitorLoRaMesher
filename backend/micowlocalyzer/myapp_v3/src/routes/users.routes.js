const { Router } = require('express');
const router = Router();

const { localizar, renderSignUpForm, renderSigninForm, signin, signup, logout, profile} = require ('../controllers/users.controlers');

router.get('/users/signup', renderSignUpForm);

router.post('/users/signup',signup);

router.get('/users/signin', renderSigninForm);

router.post('/users/signin', signin);

//quitar luego, prueba para signin
router.get('/users/profile', profile);

router.get('/users/logout', logout);

module.exports = router;
