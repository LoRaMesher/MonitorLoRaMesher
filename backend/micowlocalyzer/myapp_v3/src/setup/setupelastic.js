const ElastiClient = require("../elasticclient/elasticclient")
const client = ElastiClient.getClient();

const createTables = async() => {
    const existdata =existData().then(res => {
	    console.log(res)
      if(!res)
	    {
		   createDataLostPackets().catch(e => console.log(e))
	    }
    }).catch(e => console.log(e))
	    
	    
	    
    const existmonitorization = existMonitorization().then((res) => {
      if(!res){	    
        createMonitorization().catch(e => console.log(e))
      }

}).catch(e=>console.log(e))
	
    
   
    const existhello = existHello().then(async(res) =>{
      if(!res)
	    {
		const createhello =  await createHelloLostPackets().catch(e => console.log(e))
	    	return createhello
	    }
	    

    }).catch(e=>console.log(e))
	    
	   
	return existhello    
   
   
}


const createMonitorization = async() => {
  try{ 

  const create = await client.indices.create({
        index: 'monitorization3',
	        wait_for_active_shards: '1',
             body:{
            mappings : {
		    properties :{ 
                  broadcast : {
                    type : 'integer'
                  },
                  datapackme : {
                    type : 'integer'
                  },
                  dstinyunreach : {
                    type : 'integer'
                  },
                  fwdpackets : {
                    type : 'integer'
                  },
                  iamvia : {
                    type : 'integer'
                  },
                 localaddress : {
                    type: 'keyword'
                  
                  },
                  notforme : {
                    type : 'integer'
                  },
                  queuesendsize : {
                    type : 'integer'
                  },
                  rechellopackets : {
                    type : 'integer'
                  },
                  recpackets : {
                    type : 'integer'
                  },
                  senddatapackets : {
                    type : 'integer'
                  },
                  sendhellopackets : {
                    type : 'integer'
                  },
                  sendpackets : {
                    type : 'integer'
                  },

		receivedcontrolbytes : {
			type: 'integer'
		},
			
		receivedpayloadbytes : {
			type: 'integer'
		},
		sendcontrolbytes : {
			type: 'integer'
		},
		sendpayloadbytes : {
			type: 'integer'
		},
		throughputsend: {

			type: 'integer'
		},
		 troughputreceived:{
			type: 'integer'
		},
		 overheadsend:{
			type: 'integer'
		},
		overheadreceived:{
			type: 'integer'
		},

                  
                  timestamp: {
                  type:   'date',
                  format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis||yyyy-MM-dd\'T\'HH:mm:ss.SSSZ'
                },
                  totalreceived : {
                    type : 'integer'
                  }
		    }
                
              }
        }
      })
      console.log(create)
	  return create
    }catch(error){
      console.log(error)
    }
}


const createDataLostPackets = async() => {
  try{

 const create = await client.indices.create({
      
      index: 'datalostpackets',
      wait_for_active_shards: '1',
      body:{
        mappings : {
          properties : {
             localaddress : {
              type: 'keyword',
            fields: {
              keyword: { 
                type: 'keyword'
              }
            }
               
             },
              
              recpackets : {
              type : 'integer'
            },
            
            sentdatapackets : {
              type : 'integer'
            },
           boardsinnet:{
             type:'integer'
           },
           theoreticalrecpackets : {
            type : 'integer'
          },
          
            timestamp: {
            type:   'date',
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis||yyyy-MM-dd\'T\'HH:mm:ss.SSSZ'
          }
            }
          }
      }
    })
    console.log(create);
  }catch(error){
    console.log(error)
  }
}

const createHelloLostPackets = async() => {
  try{
  const create = await client.indices.create({
      
      index: 'hellolostpackets',
      wait_for_active_shards: '1',
      body:{
        mappings : {
          properties : {
             localaddress : {
              type: 'keyword',
            fields: {
              keyword: { 
                type: 'keyword'
              }
            }
               
             },
             
              rechpackets : {
              type : 'integer'
            },
            
            senthellopackets : {
              type : 'integer'
            },
            boardsinnet:{
             type:'integer'
           },
           theoreticalrecpackets : {
            type : 'integer'
          },
          
            timestamp: {
            type:   'date',
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis||yyyy-MM-dd\'T\'HH:mm:ss.SSSZ'
          }
            }
          }
      }
    })
    console.log(create)
  }catch(error){
    console.log(error)
  }
}

const deleteMonitorization = async() => {
 const deletemonitorization = await client.delete({
    index: 'monitorization3',
    wait_for_active_shards:1,
    refresh:'true',

  })
  console.log(deletemonitorization)
}

const deleteHelloLostPackets = async() => {
  const deleteHello = await client.delete({
    index: 'hellolostpackets',
    wait_for_active_shards:1,
    refresh:'true',
    
  })
  console.log(deleteHello)
}

const deleteDataLostPackets = async() => {
  const deletedata = await client.delete({
    index: 'datalostpackets',
    wait_for_active_shards:1,
    refresh:'true',
    
  })
  console.log(deletedata)
}

const existMonitorization = async() => {
  try {
  const response = await client.indices.exists({
    index: 'monitorization3',
   
  })
  
   // console.log(response) 
    return response
  
   
    
	    
  
}catch(error){
  console.log(error)
}
}

const existHello = async() => {
  try {
  const response = await client.indices.exists({
    index: 'hellolostpackets',
    
  })
  
  
  // console.log(response)
  return response

 
 


}catch(error){
  console.log(error)
}
}

const existData = async () => {
  try {
  const response = await client.indices.exists({
    index: 'datalostpackets',
   
  })
  
    //	  console.log(response)
  return response
  
   
    
	  
  
}catch(error){
  console.log(error)
}
}


module.exports = createTables

