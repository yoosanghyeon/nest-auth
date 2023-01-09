import { Controller, Request, Get, Post, UseGuards, Body, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service'
import { Role } from './auth/role.enum'
import { Roles } from './auth/roles.decorator'
import { RolesGuard } from './auth/roles.guard'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UserLoginDto } from './dto/UserLoginDto';



@ApiTags('인증 API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private authService: AuthService, 
    private usersService : UsersService,
    ) {}

  @ApiOperation({ summary: '유저 로그인 API', description: '유저 로그인' })
  @ApiBody({description: "id와 password 입력", type: UserLoginDto})
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Auth 저장 프로필', description: '유저 Token 프로필' })
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
 


}
