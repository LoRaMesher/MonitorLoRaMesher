const { Router } = require('express');
const router = Router();

const  { gettest,posttest } = require ('../controllers/test.controlers');


//router.post('/send_gps');
router.get('/get_test', gettest);
router.post('/post_test',posttest);
module.exports = router;
