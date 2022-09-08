const { Router } = require('express');
const router = Router();

const { localizar} = require ('../controllers/localizar.controlers');
const { isAuthenticated} = require('../helpers/auth.js');

router.get('/localizar', isAuthenticated, localizar);

//router.get('/locs', isAuthenticated, renderLocs);

//router.get('/locs/add', isAuthenticated, renderLocsForm);

//router.post('/locs/new-note', isAuthenticated, createNewLoc);

module.exports = router;
