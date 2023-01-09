import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectDpartmentDto {
  
  @ApiProperty({description:"회사 -> 전체 부서", example:"1"})
  @IsNotEmpty()
  dpartIndex: string;

}
 