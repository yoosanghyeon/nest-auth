import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsertDpartmentListDto {

  @ApiProperty({description:"부모 부서 번호", example:"1"})
  @IsOptional()
  parentId : number;
}
 