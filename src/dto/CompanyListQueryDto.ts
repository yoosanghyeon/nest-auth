import { IsNotEmpty } from 'class-validator';

export class CheckMemberDto {

    @IsNotEmpty()
    page : number;

    @IsNotEmpty()
    perPage : number;
  
  }