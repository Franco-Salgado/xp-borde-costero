#include <string>

//DS18B20 libraries
#include <OneWire.h>
#include <DallasTemperature.h>
// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;
// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);
// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

//Sensor UV
//pin definitions
int UV_OUT = 13;    //Sensor Output
int REF_3V3 = 26;   //3.3V power on the Arduino board

//bme280 libraries
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
//bme280 defines
#define BME_SCK 18
#define BME_MISO 19
#define BME_MOSI 23
#define BME_CS 5*/
#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme;

//ble libraries
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
//ble defines
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define TEMP_CHARACTERISTIC_UUID "6046f3b2-769f-400c-8d67-8a856e09121a"
#define HUM_CHARACTERISTIC_UUID "b9d456ea-5ab6-4350-adc0-10e2272b87df"
#define PRESS_CHARACTERISTIC_UUID "5d5e967f-b7ee-4fdf-926c-219ee25e8bcc"
#define TEMP_DS18B20_CHARACTERISTIC_UUID "7e133607-da9c-4444-b622-f8421eb2ba71"
#define UV_ML8511_CHARACTERISTIC_UUID "c5e758bb-6698-4f7c-b232-d7f19ab2d57f"

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;
BLECharacteristic *pCharacteristicTemp;
BLECharacteristic *pCharacteristicHum;
BLECharacteristic *pCharacteristicPress;
BLECharacteristic *pCharacteristicTempDS18B20;
BLECharacteristic *pCharacteristicUVml8511;


void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");
  sensors.begin();

  BLEDevice::init("ESP32-Sensor");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristicTemp = pService->createCharacteristic(
                                         TEMP_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristicHum = pService->createCharacteristic(
                                         HUM_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );        

  pCharacteristicPress = pService->createCharacteristic(
                                         PRESS_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );           

  pCharacteristicTempDS18B20 = pService->createCharacteristic(
                                         TEMP_DS18B20_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
                                       
  pCharacteristicUVml8511 = pService->createCharacteristic(
                                         UV_ML8511_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");

  //bme280 code
  bool status;

  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
    }
}

void loop() {
  int uv_Level = analogRead_average(UV_OUT);
  int ref_Level = analogRead_average(REF_3V3);
  float output_Voltage = 3.3 / ref_Level * uv_Level;
  float uvIntensity = mapfloat(output_Voltage, 0.99, 2.8, 0.0, 15.0);
 
  sensors.requestTemperatures();
  std::string temp = std::to_string(bme.readTemperature());
  std::string hum = std::to_string(bme.readHumidity());
  std::string press = std::to_string(bme.readPressure());
  std::string tempds18b20 = std::to_string(sensors.getTempCByIndex(0));
  std::string uvml8511 = std::to_string(uvIntensity);

  pCharacteristicTemp->setValue(temp);
  pCharacteristicHum->setValue(hum);
  pCharacteristicPress->setValue(press);
  pCharacteristicTempDS18B20->setValue(tempds18b20);
  pCharacteristicUVml8511->setValue(uvml8511);
  delay(2000);
}

//Uv Functions
//Takes an average of readings on a given pin
//Returns the average
int analogRead_average(int pinToRead)
{
  int NumberOfSamples = 8;
  int runningValue = 0; 

  for(int x = 0; x < NumberOfSamples; x++)
    runningValue += analogRead(pinToRead);
  runningValue /= NumberOfSamples;

  return(runningValue);
}

//The Arduino Map function but for floats
//From: http://forum.arduino.cc/index.php?topic=3922.0
float mapfloat(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
