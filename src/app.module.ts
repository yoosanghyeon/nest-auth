import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KnexModule } from 'nest-knexjs'

@Module({
  imports: [ KnexModule.forRootAsync({
    useFactory: () => ({
      config: {
        client: 'mysql2',
        version: '5.7',
        connection: {
          host: '127.0.0.1',
          user: 'pttadmin',
          password: 'Ksr5544!',
          database: 'practice',
        },
      },
    }),
  }),
  AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
