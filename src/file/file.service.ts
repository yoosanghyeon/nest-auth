import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';

@Injectable()
export class FileService {
    
    constructor(@InjectKnex() private readonly knex: Knex) {}

    async fileInsert(filePath : string){
        return this.knex('upload_files').insert({
            'file_path' : filePath
        })
    }

}
