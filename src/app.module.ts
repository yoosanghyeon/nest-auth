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

import { validate } from './util/env.validation';
import { MqttModule } from './mqtt/mqtt.module';
import { ChattingController } from './chatting/chatting.controller';
import { ChattingService } from './chatting/chatting.service';
import { GpsController } from './gps/gps.controller';
import { GpsService } from './gps/gps.service';


@Module({
  imports: [
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot : "/uploads"
    }),
    // 파일 업로드
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
    // 환경 변수
    ConfigModule.forRoot(
      {
        isGlobal: true, // 전체적으로 사용하기 위해
        envFilePath: `.${process.env.NODE_ENV}.env`,
        validate
      }
    ),
    KnexModule.registerAsync({
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
  controllers: [AppController, DpartmentController, CompanyController, RoleController, FileController, ChattingController, GpsController],
  providers: [AppService, DpartmentService, CompanyService, RoleService, FileService, ChattingService, GpsService],
})
export class AppModule {}
