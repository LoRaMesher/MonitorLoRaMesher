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

#Main programs
In the directory examples there is a directory called TFG with the main test program to try this library. You should copy paste it to a new project in platformio. The most important files inside it are the platformio.ini file and the main.cpp.
In the following lines I'm leaving the documentation of the main program.

## Introduction
Main project for testing the LoRaMesher with the network module

## Description
A data packet will be created and encapsulated and sent via broadcast . Main program specially designed to see results into the elastic search server implemented in [this](https://github.com/pellax/micowlocalyzer/blob/cronversion/README.md) repo.
### Set up
Open the directory ExampleSergi with the PlatformIO IDE
### Compilation
You have to delete HTTPClient from the library dependences, concretely from the RadioLib library because it's duplicated and has conflict with Arduino HttpClient. You have to comment all the references as well. 
### Deploy on local environment
There are some values that must be changed to have the whole system working in a local environment.
### Network.h

> In line 35 there is a host declaration called host3. This is the only host variable that is being used in the code. It is pointing to the only endpoint available in our node server so please ensure that the IP is the same as the IP where you have your container with the node server running. The endpoint has to remain the same, otherwise it won't work.

> In line 18 and 19 there are the SSID and the password of the WiFi. Please ensure that these are the credentials corresponding to your WiFi credentials otherwise the boards won't connect to the WiFi and they will not be able of doing any http request. Notice that all the data travel through post requests so having a WiFi connection is essential for the correct working of the whole system.

### Setup (Additional advices)
We recommend the two steps build and flash when you connect the boards.
1. Left click on the build button selecting the optiob build hidden at the menu at your left side behing the PlatformIO icon, then all the libraries should download. Next the word success should appear in the console. If there is any error look at the troubleshooting section.
2. Left Click on the arrow to flash one board at a time, wait until no more messages are printed out through the console.
### Setup troubleshooting
Some errors may appear. One well known error is the compiler complaining about the HTTPClient. This may be caused by a double declaration of the HTTPClient, look the Compilation section to solve this issue. Please update the readme file if there are any other unknown issues.
## update.py
This file is supposed to flash all plugged boards at a time but It may give some problems. If your boards are not from the same kind, or if you are using windows, some of the instructions may not work properly. If this script give strange messages, please flash boards one by one. 

## Platformio.ini
This file has all the libraries needed to have a main program prepared to work with the node and elastic module located in the branch called cronversion located in [this](https://github.com/pellax/micowlocalyzer/tree/cronversion)repository. If you want to modify the main program make sure to not change the platformio.ini file.


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

