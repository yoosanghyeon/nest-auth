import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service'
import { Role } from './auth/role.enum'
import { Roles } from './auth/roles.decorator'
import { RolesGuard } from './auth/roles.guard'


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService, private usersService : UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
 
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('test')
  async getTest(){
    const user = await this.usersService.findAll(); 
    return user
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post('test')
  async getPostTest(){
    const user = await this.usersService.findAll(); 
    return user
  }


}
