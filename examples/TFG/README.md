# Introduction
Main project for testing the LoRaMesher with the network module

# Description
A data packet will be created and encapsulated and sent via broadcast . Main program specially designed to see results into the elastic search server implemented in [this](https://github.com/pellax/micowlocalyzer/blob/cronversion/README.md) repo.
## Set up
Open the directory ExampleSergi with the PlatformIO IDE
## Compilation
You have to delete HTTPClient from the library dependences, concretely from the RadioLib library because it's duplicated and has conflict with Arduino HttpClient. You have to comment all the references as well. 
## Deploy on local environment
There are some values that must be changed to have the whole system working in a local environment.
## Network.h

> In line 35 there is a host declaration called host3. This is the only host variable that is being used in the code. It is pointing to the only endpoint available in our node server so please ensure that the IP is the same as the IP where you have your container with the node server running. The endpoint has to remain the same, otherwise it won't work.

> In line 18 and 19 there are the SSID and the password of the WiFi. Please ensure that these are the credentials corresponding to your WiFi credentials otherwise the boards won't connect to the WiFi and they will not be able of doing any http request. Notice that all the data travel through post requests so having a WiFi connection is essential for the correct working of the whole system.

## Setup (Additional advices)
We recommend the two steps build and flash when you connect the boards.
1. Left click on the build button selecting the optiob build hidden at the menu at your left side behing the PlatformIO icon, then all the libraries should download. Next the word success should appear in the console. If there is any error look at the troubleshooting section.
2. Left Click on the arrow to flash one board at a time, wait until no more messages are printed out through the console.
## Setup troubleshooting
Some errors may appear. One well known error is the compiler complaining about the HTTPClient. This may be caused by a double declaration of the HTTPClient, look the Compilation section to solve this issue. Please update the readme file if there are any other unknown issues.
# update.py
This file is supposed to flash all plugged boards at a time but It may give some problems. If your boards are not from the same kind, or if you are using windows, some of the instructions may not work properly. If this script give strange messages, please flash boards one by one. 

# Platformio.ini
This file has all the libraries needed to have a main program prepared to work with the node and elastic module located in the branch called cronversion located in [this](https://github.com/pellax/micowlocalyzer/tree/cronversion)repository. If you want to modify the main program make sure to not change the platformio.ini file.

