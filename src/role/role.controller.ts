import { Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { RoleService } from './role.service'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('권한 API')
@Controller('role')
export class RoleController {

    constructor(private readonly roleSerivce: RoleService){}

    @ApiOperation({ summary: '권한목록 - 회원추가시', description: '슈퍼 어드민 : 모든권한조회, 어드민 : 어드민 이하 권한 조회' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin, Role.SuperAdmin)
    @Get("insertlist")
    async getRoleList(@Request() req){
        const user = req.user
        return await this.roleSerivce.getAdminInsertList(user.role_name)
    }

}
