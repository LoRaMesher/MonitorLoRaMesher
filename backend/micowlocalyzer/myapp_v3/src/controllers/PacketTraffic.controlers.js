const PacketTrafficCtrl = {};
const ElasticClientCtrl = {};
const PacketTraffic = require("../models/PacketTraffic")
const ElasticClient = require("../elasticclient/elasticclient")

PacketTrafficCtrl.sendPacketTraffic = async (req, res) => {
	
	
	const { rp, sp, rhp, shp, dpm, brd, fwd, qss, dst, nfm, ivi,spb,scb,rpb,rcb,ladd } = req.body;
	

	let totalreceived = parseInt(rhp) + parseInt(dpm) + parseInt(brd) + parseInt(ivi) + parseInt(nfm);

	const recpackets = rp;

	const sendpackets = sp;
	const rechellopackets = rhp;
	const sendhellopackets = shp;
	const datapackme = dpm;
	const broadcast = brd;
	const fwdpackets = fwd;
	const queuesendsize = qss;
	const dstinyunreach = dst;
	const notforme = nfm;
	const iamvia = ivi;
	const localaddress = ladd;
	const sendpayloadbytes = spb;
	const sendcontrolbytes = scb;
	const receivedpayloadbytes = rpb;
	const receivedcontrolbytes = rcb;
        const throughputSend = parseInt(spb)+parseInt(scb);
        const throughputReceived = parseInt(rpb)+parseInt(rcb);
	const overheadSend = parseInt(scb)/parseInt(spb);
	
	const overheadReceived = parseInt(rcb)/parseInt(rpb)
	let senddatapackets = parseInt(sp) - parseInt(shp);

	const PacketTrafficPos = new PacketTraffic({ recpackets, sendpackets, rechellopackets, sendhellopackets, datapackme, broadcast, fwdpackets, queuesendsize, dstinyunreach, notforme, iamvia, localaddress, totalreceived });
	//DEBUG
	//console.log("total received :"+totalreceived);
	//DEBUG
	//console.log("iamvia content "+ivi);
	//DEBUG
	//console.log("local address is "+ladd);
	const Client = ElasticClient.getClient();
	
	let todaystring = new Date();
	let today = new Date()
	const years = today.getFullYear();
	const month = today.getMonth();
	const days = today.getDate();
	const hours = today.getHours();
	const minutes = today.getMinutes();
	const seconds = today.getSeconds();
	const miliseconds = today.getMilliseconds();
	//const todaystring = `${years}-${month}-${days}T${hours}:${minutes}:${seconds}.${miliseconds}Z`
	//console.log(today.toISOString())
	//today = new Date(todaystring.toISOString())
	indexMonitorization(Client, rp, sp, rhp, shp, dpm, brd, fwd,qss,dst, nfm, ivi,spb,scb,rpb,rcb,throughputSend,throughputReceived,overheadSend,overheadReceived,ladd, totalreceived, senddatapackets, today,todaystring).then(function (value) {
		// DEBUG
	//	console.log(value)
	}).catch(function (e) {
	//	console.log(e)
	})
	/*
	const { body } = getLocalAddress(Client).then(value => {
		//UpdateQuery(value, Client,localaddress)
		//console.log(value)
		.then(function (value) {
			//console.log(value)
		}).catch(function (e) {
			//console.log(e)
		})
	}).catch(function (e) {
		//console.log(e)
	})
	
//	const index = indexDataLost(Client, ladd, rp, senddatapackets, today,todaystring).then(function (value) {
		// DEBUG
		//console.log(value)
//	}).catch(function (e) {
		//console.log(e)
	})
//	const indexhello = indexHelloLost(Client, ladd, rhp, shp, today,todaystring).then(function (value) {
		// DEBUG
		//console.log(value)
	}).catch(function (e) {
		//console.log(e)
	})*/
	await Client.indices.refresh({ index: 'monitorization3' })
//	await Client.indices.refresh({ index: 'datalostpackets'})
//	await Client.indices.refresh({ index: 'hellolostpackets'})
	await PacketTrafficPos.save().then(function (value) {
		res.status(200).json({ msg: "postoki" })
	}).catch(function (e) {
		res.status(401).send("error saving info" + e)
	})

};
ElasticClientCtrl.run = async (req, res) => {
	const { address, metric, lastSeqNo, timeout, via, position } = req.body;



	res.status(200).json({ msg: "postoki" })
};

const getLocalAddress = async (Client) => {
	try {
		const response = await Client.search({
			index: 'datalostpackets',
			body: {
				aggs: {
					unique_ladd: {
						terms: {
							field: 'localaddress'
						}
					}
				}
			}


		})
		
		return response
	} catch (error) {
		//console.log(error)
	}
}
const UpdateQuery = async (value, Client,localaddress) => {
	//console.log(value)
	const nonempty = (value.aggregations.unique_ladd.buckets?.length ? true : false)
	const slot = 30000 / value.aggregations.unique_ladd.buckets.length 
	console.log(nonempty)
	if (nonempty) {
		
		const turn = value.aggregations.unique_ladd.buckets.indexOf(localaddress)*slot
		await sleep(turn)
		try {
			const result = loop(value.aggregations.unique_ladd.buckets,Client,value,localaddress).catch(e => {console.log(e)})
			} catch (error) {
			console.log(error)
		}

		
	
}
return result;
}

const indexDataLost = async (Client, ladd, rp, senddatapackets, today,todaystring) => {
	try {
		const indexret = await Client.index({
			index: 'datalostpackets',
			body: {
				localaddress: ladd.toString('utf-8'),
				lostpackets: 0,
				recpackets: rp,
				sentdatapackets: senddatapackets,
				theoreticalrecpackets: 0,
				boardsinnet:1,
				timestamp: today.setTime(Date.parse(todaystring.toISOString()))
			}
		})
		
		return indexret
	} catch (error) {
		console.log(error)
	}

}

const indexHelloLost = async (Client, ladd, rhp, shp, today,todaystring) => {
	try {
		const index = await Client.index({
			index: 'hellolostpackets',
			body: {
				localaddress: ladd.toString('utf-8'),
				losthpackets: 0,
				rechpackets: rhp,
				senthellopackets: shp,
				theoreticalrecpackets: 0,
				boardsinnet:1,
				timestamp: today.setTime(Date.parse(todaystring.toISOString()))
			}
		})
		return index;
	} catch (error) {
		console.log(error)

	}

}
const indexMonitorization = async (Client, rp, sp, rhp, shp, dpm, brd, fwd, qss, dst, nfm, ivi,spb,scb,rpb,rcb,throughputSend,throughputReceived,overheadSend,overheadReceived,ladd, totalreceived, senddatapackets, today,todaystring) => {
	try {
		const index = await Client.index({

			index: 'monitorization3',
			body: {
				recpackets: rp,
				sendpackets: sp,
				receivedcontrolbytes:rcb,
				receivedpayloadbytes:rpb,
				sendcontrolbytes:scb,
				sendpayloadbytes:spb,
				rechellopackets: rhp,
				sendhellopackets: shp,
				datapackme: dpm,
				broadcast: brd,
				fwdpackets: fwd,
				queuesendsize: qss,
				dstinyunreach: dst,
				notforme: nfm,
				iamvia: ivi,
				localaddress: ladd.toString('utf-8'),
				throughputsend:throughputSend,
				throughputreceived:throughputReceived,
				overheadsend:overheadSend,
				overheadreceived:overheadReceived,
				totalreceived: totalreceived,
				senddatapackets: senddatapackets,
				timestamp: today.setTime(Date.parse(todaystring.toISOString()))

			}
		}).then(function(value){
          //       console.log(value)
		return value
	})} catch (error) {
	//	console.log(error)
	}

}
//gpsCtrl.getgps = async(req, res) =>{
//  const gps = await Gps.find();
//res.send(JSON.stringify(gps));
// return res.status(200).json({
//     data: gps
// });
//}

const updateDataLostPackets = async(Client,obj,value) => {
	try {
	const update = await Client.updateByQuery({
	index: 'datalostpackets',
	refresh: true,
	
	 body:{
		script: {

			lang: 'painless',

			source: 'if(ctx._source.theoreticalrecpackets!=null){ctx._source.theoreticalrecpackets++;ctx.op="index";}else{ctx._source.theoreticalrecpackets=0;ctx.op="index";}'
		}
	}
	,
	query: {
		bool: {
			must: [{ match: { localaddress: obj['key'].toString() } }]
		},
		//if_seq_no:parseInt(myquerydata.hits.hits['_seq_no']),
		
	}

	,
	sort: 
		{ timestamp :'desc',ignore_unmpapped:true}
	
	  ,
	 max_docs:1 ,
	 version:false
	  
	


})
console.log(update)
setTimeout(done, 5000);
return update
	}catch(error){
		console.log(error)
	}
}

const updateHelloLostPackets = async(Client,obj,value) => {
	try{
	
	const update = await Client.updateByQuery({
	index: 'hellolostpackets',
	refresh:true,
	body:{

		script: {

			lang: 'painless',

			source: 'if(ctx._source.theoreticalrecpackets!=null){ctx.op="index";ctx._source.theoreticalrecpackets++;}else{ctx.op="index";ctx._source.theoreticalrecpackets=0;}'

		}
	}
	,
	query: {
		bool: {
			must: [{ match: { localaddress: obj['key'].toString() } }]
		},
		//if_seq_no:parseInt(myqueryhello.hits.hits['_seq_no']),
		
	}

	,
	sort:
		{ timestamp :'desc',ignore_unmpapped:true}
	
	  ,
	  version:false,

	max_docs: 1


})

console.log(update)
setTimeout(done, 5000);
return update
}catch(error){
	console.log(error)
}
}

const searchHelloLostPackets = async(Client,obj) => {
	try{
	const update = await Client.search({
	index: 'hellolostpackets',
	
	body:{

		query: {
			bool: {
				must: [{ match: { localaddress: obj['key'].toString() } }]
			}
		}
	
		,
		sort: 
			{ timestamp :'desc',ignore_unmpapped:true}
		  ,
	
		size: 1,
		
	    seq_no_primary_term:true

	}
	


})

console.log(update)
return update
}catch(error){
	console.log(error)
}
}

const searchDataLostPackets = async(Client,obj) => {
	try{
	const update = await Client.search({
	index: 'datalostpackets',
	
	body:{
		query: {
			bool: {
				must: [{ match: { localaddress: obj['key'].toString() } }]
			}
		}
	
		,
		sort: 
			{ timestamp :'desc'}
		  ,
	
		size: 1,
		
	    seq_no_primary_term:true

	
	}
	,
	

})

console.log(update)
return update
}catch(error){
	console.log(error)
}
}

const loop = async (address,Client,value,localaddress) => 
			{ 
				const loop = await Promise.allSettled(value.aggregations.unique_ladd.buckets.map(async (i) => {
				

				let obj = i;
				console.log(obj['key'])
				console.log(localaddress)

				if(obj != localaddress)
				{
				   
					sem.take(updateDataLostPackets(Client,i,value)).catch(function (e) {
					console.log(e)
					 })
					
					
					
					 sem.take(updateHelloLostPackets(Client,i,value)).catch(function (e) {
						console.log(e)
					})
					
				}
				
				}))
				return hello;
			}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

 
module.exports = PacketTrafficCtrl;


