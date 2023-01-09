import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PwCryptoUtil } from '../util/pwcrypto';

@Module({
  providers: [UsersService, PwCryptoUtil],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}