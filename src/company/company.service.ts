import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';

@Injectable()
export class CompanyService {
    constructor(@InjectKnex() private readonly knex: Knex) {}

    async getCompanyList(page : number, perPage : number){
        const query = this.knex.select('*')
        .from('company')
        .leftOuterJoin('dpartment', 'dpartment.company_index', 'company.index')
        .whereNull('parent_id');
        const result = await KnexPagination.offsetPaginate({
            query: query,
            perPage: perPage,
            goToPage: page,
          });
        return result;
    }

    async getMemberInsertCompanyList(roleName : string, companyIndex : number){
        let result = {}

        switch(roleName){
            case 'ADMIN':
                result = await this.knex.select('*')
                .from('company')
                .where({
                    index : companyIndex
                })
                break
            case 'SUPERADMIN':
                result = await this.knex.select('*')
                .from('company')
                break    
        }

        return result;

    }


}
