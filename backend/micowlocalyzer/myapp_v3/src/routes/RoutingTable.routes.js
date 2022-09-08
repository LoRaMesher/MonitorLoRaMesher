const { Router } = require('express');
const router = Router();
//const ElasticClient = require("../elasticclient/elasticclient")
//const { Client } = require('@elastic/elasticsearch')

const  { sendRoutingTable } = require ('../controllers/RoutingTable.controlers');
const { sendElasticControler } = require ('../controllers/elasticclient.controlers.js');
//const bodyParser = require('body-parser').json();
//const elasticClient = elastic.Client({node: 'localhost:9200'});
router.post('/send_RoutingTable',sendRoutingTable);
//router.get('/get_gps', getgps);
module.exports = router;
