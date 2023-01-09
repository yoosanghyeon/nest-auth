import { Injectable, OnModuleInit } from "@nestjs/common";
import { connect } from "mqtt";
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient;

  constructor(@InjectKnex() private readonly knex: Knex){}

  onModuleInit() {
    const host = 'localhost'
    const port = '1883'
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `mqtt://${host}:${port}`;


    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'mqttuser',
      password: 'pttok',
      reconnectPeriod: 1000,
    });

    
    this.mqttClient.on("connect", function () {
      console.log("Connected to CloudMQTT");
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