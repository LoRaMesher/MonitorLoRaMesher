const ElasticClient = require("../elasticclient/elasticclient")
let currentboards = 1;
let running = false;
theoreticalpackets = 0

const refresh =async() => {
Client = ElasticClient.getClient()
const resulthello = await searchHelloLostPackets(Client).catch(e => {
	console.log(e)
})

const boards = resulthello.aggregations.localaddress.buckets.length()
if (boards != currentboards){
	updateBoards(boards)
	updateBoardsHello(boards)
	currentboards = boards
}
/*
for(let i of resultData.aggregations.localaddress.buckets){
	console.log(i)
	await updateDataLostPackets(Client,i)
	await updateHelloLostPackets(Client,i)

}
*/

}

const setRunning = () => {
	running = true ;
	theoreticalpackets = currentboards - 1
	




}

const incTheoretical = () => {
	theoreticalpackets += currentboards - 1
}
const updateDataLostPackets = async(Client,obj) => {
	try {
	const update = await Client.updateByQuery({
	index: 'datalostpackets',
	refresh: true,
	
	 body:{
		script: {

			lang: 'painless',

			source: 'ctx.op="index";ctx._source.theoreticalrecpackets=params.recpackets;if(ctx._source.theoreticalrecpackets != null){ctx.op="index";ctx._source.lostpackets=ctx._source.theoreticalrecpackets-ctx._source.recpackets;}else{ctx.op="index";ctx._source.theoreticalrecpackets=params.recpackets;ctx.op="index";ctx._source.lostpackets=ctx._source.theoreticalrecpackets-ctx._source.recpackets;}',
			params:{
				recpackets:obj['doc_count']
			}
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

return update
	}catch(error){
		console.log(error)
	}
}

const updateHelloLostPackets = async(Client,obj) => {
	try{
	
	const update = await Client.updateByQuery({
	index: 'hellolostpackets',
	refresh:true,
	body:{

		script: {

			lang: 'painless',

			source: 'ctx.op="index";ctx._source.theoreticalrecpackets=params.recpackets;if(ctx._source.theoreticalrecpackets != null){ctx.op="index";ctx._source.losthpackets = ctx._source.theoreticalrecpackets - ctx._source.rechpackets;} else {ctx.op="index";ctx._source.theoreticalrecpackets=params.recpackets;ctx.op="index";ctx._source.losthpackets = ctx._source.theoreticalrecpackets - ctx._source.rechpackets;}',
			params:{
				recpackets:obj['doc_count']
			}
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

return update
}catch(error){
	console.log(error)
}
}

const getNumPlacas =async() => {

	const resulthello = await searchHelloLostPackets(Client).catch(e => {
		console.log(e)
	})
	const boards = resulthello.aggregations.localaddress.buckets.length()
    return boards;
}

const searchHelloLostPackets = async(Client) => {
	try{
	const update = await Client.search({
	index: 'hellolostpackets',
	
	body:{

		
	
		
		aggs: {
			localaddress: {
			  terms: { field: 'localaddress' }
			}
		  }
		  
	
		

	}
	


})

console.log(update)
return update
}catch(error){
	console.log(error)
}
}

const searchDataLostPackets = async(Client) => {
	try{
	const update = await Client.search({
	index: 'datalostpackets',
	
	body:{
		
	
		
		aggs: {
			localaddress: {
			  terms: { field: 'localaddress' }
			}
		  }
	}
	
	

})

console.log(update)
return update
}catch(error){
	console.log(error)
}
}
const getFirst = () => {

	const resulthello = await searchHelloLostPackets(Client).catch(e => {
		console.log(e)
	})

	return resulthello.aggregations.localaddress.buckets[0]['key']

}

const updateBoards = async(boards) => {
	try {
		await client.update({
			index: 'datalostpackets',
			id: '2',
			body: {
			  script: {
				lang: 'painless',
				source: 'ctx._source.boardsinnet = boards',
				params:{boards:boards}
				// you can also use parameters
				// source: 'ctx._source.times += params.count',
				// params: { count: 1 }
			  }
			}
		  })
	}catch(error){
		console.log(error)
	}
}

const updateBoardsHello = async(boards) => {
	try {
		await client.update({
			index: 'hellolostpackets',
			id: '3',
			body: {
			  script: {
				lang: 'painless',
				source: 'ctx._source.boardsinnet = boards',
				params:{boards:boards}
				// you can also use parameters
				// source: 'ctx._source.times += params.count',
				// params: { count: 1 }
			  }
			}
		  })
	}catch(error){
		console.log(error)
	}
}
setTimeout(() => {  console.log("Waiting"); }, 15000);
const interval = setInterval(refresh,30000);
module.exports = {interval,getNumPlacas,getFirst};







