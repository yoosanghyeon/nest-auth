import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChattingInviteDto {

  @ApiProperty({description:"채팅방 index", example:2})
  @IsNotEmpty()
  chatRoomNum : number;

  @ApiProperty({description:"유저 번호", example:2})
  @IsNotEmpty()
  memberIndex : number;

}
 