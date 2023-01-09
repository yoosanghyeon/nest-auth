import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveDpartmentDto {
  
  @ApiProperty({description:"삭제 부서번호"})
  @IsNotEmpty()
  dpartIndex: string
}
 