import { Injectable, OnModuleInit } from "@nestjs/common";
import { connect } from "mqtt";
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient;

  constructor(@InjectKnex() private readonly knex: Knex){}

  onModuleInit() {
    const host = process.env.MQTT_URL
    const port = process.env.MQTT_PORT
    const clientId =  process.env.MQTT_CLIENTID;

    const connectUrl = `mqtt://${host}:${port}`;


    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
      reconnectPeriod: 1000,
    });

    
    this.mqttClient.on("connect", function () {
      console.log("Connected to LocalMQTT");
    });
    this.mqttClient.subscribe('#', (err) =>{
        if(err){
            console.log(err);
        }
    })
    this.mqttClient.on("error", function () {
      console.log("Error in connecting to CloudMQTT");
    });

    this.mqttClient.on('message', async (topic, message, packet) => {
    
        const receivedMessage = message.toString()
        
        console.log(receivedMessage)      
    })
    
}

  publish(topic: string, payload: string): string {
    console.log(`Publishing to ${topic}`);
    this.mqttClient.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}