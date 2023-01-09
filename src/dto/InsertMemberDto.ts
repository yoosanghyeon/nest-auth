import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsertMemberDto {

  @ApiProperty({description:"회원 아이디"})
  @IsNotEmpty()
  id : string;

  @ApiProperty({description:"회원 이름"})
  @IsNotEmpty()
  name: string;

  @ApiProperty({description:"회원 비밀번호"})
  @IsNotEmpty()
  password: string;

  @ApiProperty({description:"회원 권한"})
  @IsNotEmpty()
  roleIndex: number;

  @ApiProperty({description:"회원 회사번호"})
  @IsNotEmpty()
  coIndex: number;

  @ApiProperty({description:"회원 부서번호"})
  @IsNotEmpty()
  dpartIndex: number
}
 