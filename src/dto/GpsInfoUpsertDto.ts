import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GpsInfoUpsertDto {

  @ApiProperty({description:"위도", example:"1"})
  @IsNotEmpty()
  latitude : number;

  @ApiProperty({description:"경도", example:"1"})
  @IsNotEmpty()
  longitude : number;

  @ApiProperty({description:"고도", example:"1"})
  @IsOptional()
  altitude : number = 0;
}
 