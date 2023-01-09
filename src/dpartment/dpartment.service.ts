import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { InsertDpartmentDto } from 'src/dto/InsertDpartmentDto';

@Injectable()
export class DpartmentService {
    
    constructor(@InjectConnection() private readonly knex: Knex) {}
    
    getHello() : string{
        return 'dpartment hello'
    }

    async postListDpartment(dpartNumberParam : string){
        let result = await this.knex.raw('call p_dpart_tree(?)', [dpartNumberParam]);
        return result[0][0]
    }

    async insertDpartment(insertDpartmentDto : InsertDpartmentDto){
        return this.knex('dpartment')
                .insert({
                    parent_id: insertDpartmentDto.parentId,
                    order: insertDpartmentDto.order,
                    name: insertDpartmentDto.name,
                    company_index: insertDpartmentDto.companyIndex    
                })
    }

    async hideDpartment(dpartNumberParam: string){
        let result = await this.knex.raw('call p_dpart_hide(?, 1)', [dpartNumberParam]);
        console.log(result[0]);
        return result[0]
    }

    async insertDepartmentList(company_index : number){
        const selectResult = await this.knex.select('*')
        .from('dpartment')
        .where('company_index', company_index)
        .whereNull('parent_id');
        return selectResult[0];
    }

   
    
}
