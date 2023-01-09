import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckMemberDto {

  @ApiProperty({ description: '이름' })
  @IsNotEmpty()
  memberId : string;

}
 