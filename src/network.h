#ifndef __NETWORK__
#define __NETWORK__

#include <Arduino.h>

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoLog.h>

#include "LoraMesher.h"

class Network {
private:
    int packetsend;
    int packetreceived;
    TaskHandle_t SendingData_TaskHandle = NULL;
    const char* ssid = "IoT";
    const char* password = "Cucamonga";
    //const char* ssid = "MOVISTAR_44B6";
    //const char* password = "E2zeYs8s4t6uZJ86z2C9";
    //const char *ssid = "OPPO_A9_2020";
    //const char *password = "5a9a7f6643ca";
    const int httpport = 80;
    char* Server;
    void initNetwork();
    void initHttpConnection();
    HTTPClient  micliente;
    WiFiClient client;
    HTTPClient micliente2;
    HTTPClient micliente3;
    const String host = "http://192.168.1.59:8080/send_DataPacket";;
    const String host2 = "http://192.168.1.59:8080/send_RoutingTable";
    //const String host3="http://192.168.41.159:8080/send_PacketTraffic";
    const String host3 = "http://84.88.85.2:8080/send_PacketTraffic";
    //const String host3="http://192.168.1.59:8080/send_PacketTraffic";
    int receivedpackets;
    int sendpackets;
    int receivedhellopackets;
    int sentHellopackets;
    int broadcast;
    int forwardedpackets;
    int packetsforme;
    int destinyunreach;
    int notforme;
    int datapacketforme;
    int iamvia;
    uint16_t localaddress;
    void actualizeVariables();
    LoraMesher& radio = LoraMesher::getInstance();

public:
    Network();
    ~Network();
    void buildClient();
    int doPostDataPacket(uint8_t dst, uint8_t src, uint8_t type, uint32_t payload, uint8_t sizExtra, uint8_t* address, int32_t* metric);
    int doPostRoutingTable(byte address, int metric, int lastSeqNo, unsigned long timeout, byte via);
    int doPostPacketTraffic();
    void sendData();
    void initializeDataSendingTask();
    void setLocalAddress(uint16_t address);
};


#endif