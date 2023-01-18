import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { Role } from 'src/auth/role.enum';

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

        switch(roleName){
            case Role.Admin:
                return await this.knex.select('*')
                .from('company')
                .where({
                    index : companyIndex
                })
                
            case Role.SuperAdmin:
                return await this.knex.select('*')
                .from('company')
                   
        } 

    }


    async getCompanyPersonList(memberIndex : number, coIndex : number){

        return await this.knex('member').select(['index', 'id', 'name'])
        .where({
            co_index : coIndex
        })
        .whereNot({
            index : memberIndex
        })
    }


}
