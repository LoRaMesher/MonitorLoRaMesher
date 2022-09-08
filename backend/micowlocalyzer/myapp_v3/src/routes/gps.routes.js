const { Router } = require('express');
const router = Router();

const  { getgps } = require ('../controllers/gps.controlers');


router.post('/send_gps');
router.get('/get_gps', getgps);
module.exports = router;
