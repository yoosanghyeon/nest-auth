import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsertDpartmentDto {

  @ApiProperty({description : "부서 상위번호"})
  @IsNotEmpty()
  parentId : number;

  @ApiProperty({description : "해당 부서 순서"})
  @IsNotEmpty()
  order: string;

  @ApiProperty({description : "부서 이름"})
  @IsNotEmpty()
  name: string;

  @ApiProperty({description : "소속 회사번호"})
  @IsNotEmpty()
  companyIndex: number;
}
 