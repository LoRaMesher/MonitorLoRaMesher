# MonitorLoRaMesher
A monitoring system for the LoRaMesher library


# Backend directory 

## Disclaimer
Stable version is in branch cronversion. An automatic setup is implemented but you should check first that the automatic setup has been successful. This may vary depending on the features of your server. Look carefully the troubleshooting section.

## Introduction
Node server with Mongo database and ElasticSearch Engine, all connected with Elastic Javascript Client
It has several branches
- single node is an Elastic server with node with one elastic node.
- Master is an Elastic server with three elastic nodes
- 8 Auth is an Elastic test server version 8, not working
- Elastic7Auth is an Elastic server with authentication from elastic side with three Elastic nodes and the node side still to do.
- Cronversion is an Elastic server 7.17 but with automatic setup
## Troubleshooting for the cronversion branch
The automatic setup is supposed to work at any kind of server with docker-compose installed. Nevertheless, depending on server memory and cpu features, the elastic server might not be ready when the automatic setup requests are executed. In that case you should see some kind of error like ECONNREFUSED which means that the server is receiving requests at some point when the server is still not ready to work. In that case you should go to the file called index.js located in the directory /myapp_v3/src . In line number 12 there is a Timeout set to 35000. If you see any ERRCON REFUSED error, then you should increase the timeout value up to 45000 or even more. At some point the server should be ready to receive the requests and no error should appear. To ensure that the automatic set up worked properly there are some additional checks that the user can perform .
## Additional checks
In the kibana UI there is a hamburger menu at the left side of the screen . If you right click on it a menu should appear, if you scroll down there is an option called Dev tools, right click on it .There a consolo should appear. Introduce the following command, select the instruction and righ click into the play symbol.
`GET monitorization3/_mapping`
The response of the elastic engine should look **exactly** like this to have the whole system ready to work with te LoRa boards
```
{
  "monitorization3" : {
    "mappings" : {
      "properties" : {
        "broadcast" : {
          "type" : "integer"
        },
        "datapackme" : {
          "type" : "integer"
        },
        "dstinyunreach" : {
          "type" : "integer"
        },
        "fwdpackets" : {
          "type" : "integer"
        },
        "iamvia" : {
          "type" : "integer"
        },
        "localaddress" : {
          "type" : "keyword"
        },
        "notforme" : {
          "type" : "integer"
        },
        "overheadreceived" : {
          "type" : "integer"
        },
        "overheadsend" : {
          "type" : "integer"
        },
        "queuesendsize" : {
          "type" : "integer"
        },
        "receivedcontrolbytes" : {
          "type" : "integer"
        },
        "receivedpayloadbytes" : {
          "type" : "integer"
        },
        "rechellopackets" : {
          "type" : "integer"
        },
        "recpackets" : {
          "type" : "integer"
        },
        "sendcontrolbytes" : {
          "type" : "integer"
        },
        "senddatapackets" : {
          "type" : "integer"
        },
        "sendhellopackets" : {
          "type" : "integer"
        },
        "sendpackets" : {
          "type" : "integer"
        },
        "sendpayloadbytes" : {
          "type" : "integer"
        },
        "throughputreceived" : {
          "type" : "long"
        },
        "throughputsend" : {
          "type" : "integer"
        },
        "timestamp" : {
          "type" : "date",
          "format" : "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis||yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        },
        "totalreceived" : {
          "type" : "integer"
        },
        "troughputreceived" : {
          "type" : "integer"
        }
      }
    }
  }
}
```
This response will mean that your system is set up correctly and you can start sending requests from your LoRa boards.
The client software for the LoRa boards is located in [this](https://github.com/pellax/TFG) link.
## Set up 
1. First increase virtual memory heap, execute `sysctl -w vm.max_map_count=262144` in linux.
2. Inside directory myapp_v3 execute
`docker-compose up `
3. Wait for the log message `Kibana is now degraded` . The server is now ready for the incoming data.

# Observed problems of the whole system
In the kibana UI you will see spontaneous resets in the test boards. The origin of these issues are still unknown, on the other hand you can see already the utility of the system working since the values appear in the kibana UI

# Kibana Instructions
At the left side of the kibana that will be runing on the address http//myip:5601 you will see in the Analytics section, the dashboards menu. In a clean installation, the Kibana will invite you to create your index patterns. The user should tell the kibana to create an index pattern with the name of monitorization3 and select the field timestamp as a timestamp field. Then the option of creating multiple dashboards should be available. The X axis will correspond for the timestamp, and the Y axis should use the max function along with the choosen field to be observed . You should choose in the top menu a refresh interval, as well as a time interval. The final step will be saving the dashboard.
The steps will look like this:

1. Create index pattern
2. Create dashboards using timestamp as X axis and max function of the desired field as Y axis
3. Save the visualization
4. Save the dashboard to have it available at any time
### Original Instructions
These instruction belong to the original code inherited from cowlocalizer and they are not useful anymore. Since the current project is all containerized, please follow the previous instructions to lift the server through the docker-compose container, you are not supposed to run any node server outside the docker container or anything. These are only here to give credits to the original authors of the server, but many of these parts have been removed from the current project. 
//for node
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

//MongoDB
sudo apt install -y mongodb
npm i express express-handler express-session method-override mongoose passport passport-local bcryptjs connect-flash express-handlebars
npm install dotenv nodemon npm-check-updates -D

npm ls | grep nodemon
LORA_MONGODB_HOST=localhost
LORA_MONGODB_DATABASE=lora-app

>cd myapp_v3
>npm run dev

