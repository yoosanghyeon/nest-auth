import { Body, Controller, Get, Post, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChattingService } from './chatting.service';
import { ChattingCreateDto } from 'src/dto/ChattingCreateDto';
import { ChattingInviteDto } from 'src/dto/ChattingInviteDto';

@Controller('chatting')
export class ChattingController {

    constructor(private readonly chattingService : ChattingService){
    }

    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin, Role.Admin)
    @Post("/create")
    async createChattingRoom(@Request() req, @Body() chattingCreateDto : ChattingCreateDto){
        const user = req.user;
        const chatCreateResult = await this.chattingService.createChattingRoom(chattingCreateDto.chatRoomNm,
            chattingCreateDto.chatRoomPassword,
            chattingCreateDto.chatRoomTyp,
            user.username,
            user.memberIndex,
            'admin')
        
        return {
            createRoomNum : chatCreateResult
        };
    }

    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin, Role.Admin, Role.User)
    @Get("/userlist")
    async userList(@Request() req){
        const user = req.user;
        const result = await this.chattingService.userChatList(user.memberIndex);
        return result;
    }

    @ApiBearerAuth('defaultBearerAuth')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SuperAdmin, Role.Admin, Role.User)
    @Post("/invite")
    async inviteUser(@Request() req, @Body() chattingInviteDto : ChattingInviteDto){
        console.log(chattingInviteDto);
        const result = await this.chattingService.inviteChatRoom(chattingInviteDto.chatRoomNum, chattingInviteDto.memberIndex, 'user')
        return { inviteChatRoomNum : result };
    }
    

}
