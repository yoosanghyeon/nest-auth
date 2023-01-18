import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChattingCreateDto {

  @ApiProperty({description:"채팅방 제목", example:"1"})
  @IsNotEmpty()
  chatRoomNm : string;

  @ApiProperty({description:"채팅방 비밀번호", example:"1"})
  @IsOptional()
  chatRoomPassword : string;

  @ApiProperty({description:"채팅방 타입 : 오픈, 비밀번호", example:"1"})
  @IsNotEmpty()
  chatRoomTyp : string;
}
 