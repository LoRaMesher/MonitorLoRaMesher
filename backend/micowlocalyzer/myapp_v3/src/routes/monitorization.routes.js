const { Router } = require('express');
const router = Router();
//const ElasticClient = require("../elasticclient/elasticclient")
//const { Client } = require('@elastic/elasticsearch')

const  { sendPacketTraffic } = require ('../controllers/PacketTraffic.controlers');

//const bodyParser = require('body-parser').json();
//const elasticClient = elastic.Client({node: 'localhost:9200'});
router.post('/send_PacketTraffic',sendPacketTraffic);
//router.get('/get_gps', getgps);
module.exports = router;
