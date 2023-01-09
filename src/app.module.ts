import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KnexModule } from '@mithleshjs/knex-nest'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DpartmentController } from './dpartment/dpartment.controller';
import { DpartmentService } from './dpartment/dpartment.service';
import { CompanyController } from './company/company.controller';
import { CompanyService } from './company/company.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttModule } from './mqtt/mqtt.module';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY_MQTT_SERVICE',  //* MY_MQTT_SERVICE : 의존성 이름
        transport: Transport.MQTT,
        options: {
          host: 'localhost',
          port: 1883,
          clientId : 'api_server01',
          username : 'mqttuser',
          password : 'pttok'
        }
      }
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot : "/uploads"
    }),
    // ConfigService 를 inject 하기 위해
    MulterModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            storage: diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'uploads')
                },
                filename: (req, file, cb) => {
                    // 업로드 후 저장되는 파일명을 랜덤하게 업로드 한다.(동일한 파일명을 업로드 됐을경우 오류방지)
                    cb(null, Date.now() + "-" + file.originalname)
                },
            }),
        }),
        inject: [ConfigService],
    }),

    ConfigModule.forRoot(), KnexModule.registerAsync({
    useFactory: () => ({
      config: {
        client: 'mysql2',
        version: '5.7',
        connection: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_SCHEMA,
        },
      },
    }),
  }),
  AuthModule, UsersModule, MqttModule],
  controllers: [AppController, DpartmentController, CompanyController, RoleController, FileController],
  providers: [AppService, DpartmentService, CompanyService, RoleService, FileService],
})
export class AppModule {}
