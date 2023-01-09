import { Body, Controller, Get, Post, Put, UseGuards, Request } from '@nestjs/common';
import { DpartmentService } from './dpartment.service';
import { SelectDpartmentDto } from '../dto/SelectDpartmentDto'
import { InsertDpartmentDto } from 'src/dto/InsertDpartmentDto';
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RemoveDpartmentDto } from 'src/dto/removeDpartmentDto';
import { InsertDpartmentListDto } from 'src/dto/InsertDpartmentListDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('부서 API')
@Controller('dpartment')
export class DpartmentController {

  constructor(private dpartmentService : DpartmentService){}

  @ApiOperation({ summary: '부서 목록 API', description: '상위부서로 하위부서 조회 CALL_TREE()' })
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post("list")
  async getDepartList(@Body() selectDpartmentDto : SelectDpartmentDto){
    let result = await this.dpartmentService.postListDpartment(selectDpartmentDto.dpartIndex);
    return result;
  }

  @ApiOperation({ summary: '부서 추가 API', description: '상위부서 인덱스 포함하여 부서 추가' })
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post("add")
  async setDepart(@Body() insertDpartmentDto : InsertDpartmentDto){
    return await this.dpartmentService.insertDpartment(insertDpartmentDto);
  }

  @ApiOperation({ summary: '부서 삭제 API', description: '부서 삭제 API' })
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Put("remove")
  async removeDepart(@Body() removeDpartmentDto : RemoveDpartmentDto){
    return await this.dpartmentService.hideDpartment(removeDpartmentDto.dpartIndex);
  }

  @ApiOperation({ summary: '부서 목록 API - 회원추가시', description: '슈퍼어드민 -> 전체목록, 어드민 -> 해당 회사 부서 목록' })
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post("insertList")
  async selectInsertDepartList(@Request() req, @Body() insertDpartmentListDto : InsertDpartmentListDto) {
 
    const user = req.user;
    let result = {}
    let parentDepartment : any = {}
    switch(user.role_name){
      case 'ADMIN':
        parentDepartment = await this.dpartmentService.insertDepartmentList(user.co_index);
        result = await this.dpartmentService.postListDpartment(parentDepartment.id)
        break
      case 'SUPERADMIN':
        parentDepartment = await this.dpartmentService.insertDepartmentList(insertDpartmentListDto.parentId);
        result = await this.dpartmentService.postListDpartment(parentDepartment.id)
        break
    }
   
    return result;
  }


}
