import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto{
    
    @ApiProperty({description:"유저 아이디", example:"yoo"})
    @IsNotEmpty()
    username: string;

    @ApiProperty({description:"유저 비밀번호", example:"1234"})
    @IsNotEmpty()
    password: string;

}