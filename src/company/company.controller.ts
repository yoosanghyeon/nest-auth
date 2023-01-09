import { Body, Controller, Get, Post, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CompanyService } from './company.service'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('회사관련 API')
@Controller('company')
export class CompanyController {
    
    constructor(private companyService : CompanyService){}

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
    @ApiOperation({ summary: '회사 목록 API', description: '슈퍼어드민 -> 전체목록, 어드민 -> 해당 회사 유저 목록' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin)
    @Get("list")
    async getCompanyList(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page, @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage){
        return await this.companyService.getCompanyList(page, perPage);
    }


    @ApiOperation({ summary: '회원 추가시 회사 목록 API', description: '슈퍼어드민 -> 전체 회사 목록, 어드민 -> 해당 회사 목록' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin, Role.Admin)
    @Get("insertList")
    async getInsertCompanyList(@Request() req){
        const user = req.user;
        return await this.companyService.getMemberInsertCompanyList(user.role_name, user.co_index);
    }

}
