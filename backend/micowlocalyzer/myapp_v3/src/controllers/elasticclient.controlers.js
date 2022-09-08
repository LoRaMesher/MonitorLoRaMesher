const  ElasticClientCtrl = {};

//const ElasticClient = require("../elasticclient/elasticclient")
//const { Client } = require('@elastic/elasticsearch')
//require("dotenv").config();
//const elasticUrl = "http://localhost:9200"
//const client = new Client({node:elasticUrl})
ElasticClientCtrl.run = async (req,res) => {
    const{address,metric,lastSeqNo,timeout,via,position} = req.body;
    


    res.status(200).json({msg:"postoki"})
    /*
    res.status(200).json({msg:"postoki"})
    }).catch(function(err){
	    res.status(401).send("error sending routing info to elastic server")
    })
*/	
};

//gpsCtrl.getgps = async(req, res) =>{
  //  const gps = await Gps.find();
    //res.send(JSON.stringify(gps));
    // return res.status(200).json({
    //     data: gps
    // });
//}
module.exports = ElasticClientCtrl;
