import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('권한 API')
@Injectable()
export class RoleService {

    constructor(@InjectKnex() private readonly knex: Knex) {}

    async getAdminInsertList(userRole : string){
        return userRole === 'SUPERADMIN' ? 
        await this.knex.select('*').from('roles') 
        : await this.knex.select('*').from('roles').whereNot('role_name', 'SUPERADMIN')

    }


}
