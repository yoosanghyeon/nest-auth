import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    var user = await this.usersService.findOne(username);
    if (user[0] && user[0].password === pass) {
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, userId: user.id, role_index : user.role_index, role_name: user.role_name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}