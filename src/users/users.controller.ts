import { Controller, Get, Post, UseGuards, Request, Query, HttpException, HttpStatus, Body, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsertMemberDto } from '../dto/InsertMemberDto'
import { CheckMemberDto } from 'src/dto/CheckMemberDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
    
    constructor(private readonly usersService : UsersService ){}

    @ApiQuery({
      name: "perPage",
      required: true,
      description: "한번에 가져오는 개수",
      example: 10
    })
    @ApiQuery({
      name: "page",
      required: true,
      description: "불러올 페이지",
      example: 1
    })
    @ApiOperation({ summary: '유저 목록 API', description: '슈퍼어드민 -> 전체목록, 어드민 -> 해당 회사 유저 목록' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin, Role.SuperAdmin)
    @Get("list")
    async getMemberList(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page, @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage){
      const user = req.user;
      let result = {}
  
      switch(req.user.role_name){
        case 'ADMIN':
          result = await this.usersService.findAdminMemberList(user.userId, user.co_index, perPage, page)
          break
        case 'SUPERADMIN':
          result = await this.usersService.findSuperAdminMemberList(user.userId, perPage, page)
          break
        default:
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      
      }

      return result;
    }
  
    @Post("addMember")
    @ApiBearerAuth('defaultBearerAuth')
    @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin, Role.SuperAdmin)
    async insertMemberList(@Request() req, @Body() insertMemberList : InsertMemberDto ){
        const result = await this.usersService.insertMember(insertMemberList);
        const insertIdNum = result[0];
        let e164Num = await this.usersService.generateE164(insertIdNum);
        await this.usersService.updateMemberE164(e164Num, insertIdNum);
        return result;
    }

    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin, Role.SuperAdmin)
    @ApiBearerAuth('defaultBearerAuth')
    @ApiOperation({ summary: '유저 중복 체크 API', description: '유저 아이디 중복체크' })
    @Post("check")
    async checkMember(@Request() req, @Body() checkMemberDto : CheckMemberDto){
        const result = await this.usersService.checkMemberId(checkMemberDto.memberId);
        if(result.length > 0){
            throw new HttpException('Member ID Duplication', HttpStatus.BAD_REQUEST)
        }
        return result;
    }



}
