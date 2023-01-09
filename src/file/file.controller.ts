import { Body, Controller, Get, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors, Param,
    Res, Query, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileService } from './file.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('파일 API')
@Controller('file')
export class FileController {

    constructor(readonly fileService : FileService){}

    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: { // 👈 this property
              type:'string',
              format: 'binary'
            },
          },
        },
      })
    @UseInterceptors(FileInterceptor('file'))
    async fileUpload(@UploadedFile() file: Express.Multer.File){
        
        const result = await this.fileService.fileInsert(file.path)
        console.log(result)
        return file
    }

    // @Get(':path/:name')
    // async download(@Res() res: Response, @Param('path') path: string, @Param('name') name: string, @Query('fn') fileName) {
    //     res.download(`${path}/${name}`, fileName);
    // }

}
