const { Router } = require('express');
const router = Router();

const  { sendDataPacket } = require ('../controllers/DataPacket.controlers');


router.post('/send_DataPacket');
//router.get('/get_gps', getgps);
module.exports = router;
