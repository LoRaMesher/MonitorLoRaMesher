#include "network.h"
#include <functional>

Network::Network() {
 
  receivedpackets = 0;
  sendpackets = 0;
  receivedhellopackets = 0;
  broadcast = 0;
  forwardedpackets = 0;
  packetsforme = 0;
  destinyunreach = 0;
  notforme = 0;
  sentHellopackets = 0;
  localaddress = 0xFF;
  datapacketforme = 0;
  iamvia = 0;
  initNetwork();

}

void Network::initNetwork() {

  delay(5000);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.disconnect();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");

  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // radio = LoraMesher::getInstance();

  setLocalAddress(radio.getLocalAddress());

  initializeDatasending();
}

Network::~Network() {
  micliente.end();
  micliente2.end();
  vTaskDelete(SendingData_TaskHandle);

}

void Network::buildClient() {
  //String host3 = "http://192.168.1.60:8080/get_test";
  //String host3 ="http://192.168.1.59:8080/send_RoutingTable";

  //String host3 = "http://192.168.1.60:8080/send_gps";
  micliente.begin(host.c_str());
  micliente.addHeader("User-Agent", "DataServer/1.0", true, true);
  micliente.addHeader("Content-Type", "application/json", false, true);
  micliente2.begin(host2.c_str());
  micliente2.addHeader("User-Agent", "DataServer/1.0", true, true);
  micliente2.addHeader("Content-Type", "application/x-www-form-urlencoded", false, true);

  Log.trace(F(" HOst initialized" CR));
  micliente3.begin(host3.c_str());
  micliente3.addHeader("User-Agent", "DataServer/1.0", true, true);
  micliente3.addHeader("Content-Type", "application/x-www-form-urlencoded", false, true);


}
void Network::initializeDatasending() {
  int res;
  res = xTaskCreate(
    [](void* o) { static_cast<Network*>(o)->sendData(); },
    "Sending data Routine",
    4096,
    this,
    2,
    &SendingData_TaskHandle);
  if (res != pdPASS) {
    Log.error(F("Receive User Task creation gave error: %d" CR), res);
  }

}

void Network::sendData() {
  byte mibyte = 0x04;
  int metric = 2;
  int lastSeqNo = 5;
  unsigned long timeout = 7;
  byte via = 0x02;
  int resdata = 0;
  for (;;) {
    buildClient();
    vTaskDelay(30000 / portTICK_PERIOD_MS); //30 sec

    actualizeVariables();

    //doPostRoutingTable(mibyte,metric,lastSeqNo,timeout,via);
    doPostPacketTraffic();
    if (resdata != -1) {
      Log.trace(F(" post exito neighbour data get done successfully with value %d and with answer from the server with value" CR), resdata);
    } else {
      Log.trace(F(" Error sending neighbour data get to the server" CR));
    }
  }
}

int Network::doPostDataPacket(uint8_t dst, uint8_t src, uint8_t type, uint32_t payload, uint8_t sizExtra, uint8_t* address, int32_t* metric) {
  int res = 0;
  char buffer[80];

  StaticJsonDocument<500> doc;
  JsonArray addressValues = doc.createNestedArray("address");
  JsonArray metricValues = doc.createNestedArray("metric");
  for (int i = 0;i < sizeof(address) / sizeof(address[0]);i++) {
    addressValues.add(address[i]);

  }
  for (int i = 0;i < sizeof(metric) / sizeof(metric[0]);i++) {
    metricValues.add(metric[i]);
  }

  doc["dst"] = dst;
  doc["src"] = src;
  doc["type"] = type;
  doc["payload"] = sizExtra;

  JsonObject obj = doc.to<JsonObject>();
  serializeJson(obj, buffer);

  //sprintf(buffer,"dst=%02X&src=%02X&type=%02X&payload=%lu&sizExtra=%02X&address=%s&metric%s",dst,src,type,payload,sizExtra,*address,*metric);

  Log.trace(F("antes del post" CR));
  res = micliente.POST(buffer);

  if (res == -1) Serial.println("He intentado enviar el mensaje al servidor, pero he recibido error -1. Parece que el servidor está desconectado o no responde");
  else {
    Serial.print("He enviado el mensaje al servidor, y me ha devuelto un código HTTP ");
    Serial.println(res);
  }
  micliente.end();
  return res;
}

int Network::doPostRoutingTable(byte address, int metric, int lastSeqNo, unsigned long timeout, byte via) {
  int res = 0;
  int position = -1;
  char buffer[80];
  sprintf(buffer, "address=%hhx&metric=%d&lastSeqNo=%d&timeout=%lu&via=%hhx&position=%d", address, metric, lastSeqNo, timeout, via, position);

  res = micliente2.POST(buffer);
  if (res == -1) Serial.println("He intentado enviar el mensaje al servidor, pero he recibido error -1. Parece que el servidor está desconectado o no responde");
  else {
    Serial.print("He enviado el mensaje al servidor, y me ha devuelto un código HTTP ");
    Serial.println(res);
    Serial.print("Esto es lo que ha mandado el server como respuesta");
    Serial.println(micliente2.getString());
  }
  micliente2.end();
  return res;
}

int Network::doPostPacketTraffic() {
  int res = 0;
  int position = -1;
  char buffer[100];
  sprintf(buffer, "rp=%d&sp=%d&rhp=%d&shp=%d&dpm=%d&brd=%d&fwd=%d&pme=%d&dst=%d&nfm=%d&ivi=%d&ladd=%X", receivedpackets, sendpackets, receivedhellopackets, sentHellopackets, datapacketforme, broadcast, forwardedpackets, packetsforme, destinyunreach, notforme, iamvia, localaddress);
  res = micliente3.POST(buffer);
  if (res == -1) Serial.println("He intentado enviar el mensaje al servidor, pero he recibido error -1. Parece que el servidor está desconectado o no responde");
  else {
    Serial.print("He enviado el mensaje al servidor, y me ha devuelto un código HTTP ");
    Serial.println(res);
    Serial.print("Esto es lo que ha mandado el server como respuesta");
    Serial.println(micliente3.getString());
  }
  micliente3.end();
  return res;
}

int Network::doPostTest(int id, float lat, float longit) {
  int res = 0;
  //String buffer ="id=1&lat=8.0&long=9.1";
  char buffer[30];
  sprintf(buffer, "id=%d&lat=%f&long%f", id, lat, longit);
  res = micliente3.POST(buffer);
  if (res >= 0) {
    Serial.println(micliente3.getString());


  } else {
    Serial.print("Error code: ");
    Serial.println(res);
  }
  micliente3.end();
  return res;
}

int Network::doGetTest() {
  int res = 0;
  Serial.print("Ha llegado aquí 1");
  Log.verbose(F("ha llegado aquí verbose" CR));
  res = micliente3.GET();
  Serial.print("Ha llegado aquí");
  if (res >= 0) {
    Serial.println(micliente3.getString());

  } else {
    Serial.print("Error code: ");
    //Serial.println(res);
  }
  micliente3.end();

  return res;
}

void Network::setLocalAddress(uint16_t address) {
  localaddress = address;
}

void Network::actualizeVariables() {
  receivedpackets = radio.getReceivedDataPacketsNum();
  sendpackets = radio.getSendPacketsNum();
  receivedhellopackets = radio.getReceivedHelloPacketsNum();
  broadcast = radio.getReceivedBroadcastPacketsNum();
  forwardedpackets = radio.getForwardedPacketsNum();
  packetsforme = radio.getDataPacketsForMeNum();
  destinyunreach = radio.getDestinyUnreachableNum();
  notforme = radio.getReceivedNotForMe();
  sentHellopackets = radio.getSentHelloPacketsNum();
  datapacketforme = radio.getDataPacketsForMeNum();
  iamvia = radio.getReceivedIAmViaNum();
}





