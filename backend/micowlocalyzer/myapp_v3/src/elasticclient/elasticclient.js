
'use strict'
const { Client } = require('@elastic/elasticsearch')
require("dotenv").config();
module.exports.getClient = function(){
const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200"
const client = new Client({ node: elasticUrl});
return client
}
