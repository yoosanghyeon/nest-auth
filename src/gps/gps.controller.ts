import { Body, Controller, Get, Post, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GpsService } from './gps.service';
import { GpsInfoUpsertDto } from 'src/dto/GpsInfoUpsertDto';


@Controller('gps')
export class GpsController {

    constructor(private gpsService : GpsService){}


    @ApiOperation({ summary: '유저 GPS 정보 Upsert API', description: 'GPS 정보 업서트' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin, Role.Admin, Role.User)
    @Post("info")
    async postGpsInfo(@Request() req, @Body() gpsInfoUpsertDto : GpsInfoUpsertDto){
        const user = req.user;
        return await this.gpsService.gpsInfoUpsert(user.memberIndex, gpsInfoUpsertDto);
    }
    
}
