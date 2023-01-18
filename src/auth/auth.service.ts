import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PwCryptoUtil } from '../util/pwcrypto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private pwCryptoUtil: PwCryptoUtil
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    var user = await this.usersService.findOne(username);
    const decryptedPassword = await this.pwCryptoUtil.decrypt(user[0].password);
    if (user[0] && decryptedPassword === pass) {
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log(user)
    const payload = { 
      member_index: user.member_index,
      username: user.name, 
      userId: user.userId, 
      role_index : user.role_index, 
      role_name: user.role_name,
      co_index : user.co_index,
      dpart_index : user.dpart_index,
      e164: user.e164
    };


    return {
      memberIndex : payload.member_index,
      userName : payload.username,
      userId : payload.userId,
      roleName : payload.role_name,
      co_index : payload.co_index,
      dpart_index : payload.dpart_index,
      access_token: this.jwtService.sign(payload),
      e164: payload.e164
    };
  }
  
}