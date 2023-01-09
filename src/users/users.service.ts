import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { InsertMemberDto } from 'src/dto/InsertMemberDto'
import { PwCryptoUtil } from '../util/pwcrypto'


export type User = any;

@Injectable()
export class UsersService {
  
  constructor(@InjectKnex() private readonly knex: Knex, private readonly pwCryptoUtil : PwCryptoUtil) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.knex.select({
      member_index : 'member.index',
      name : 'member.name',
      userId : 'member.id',
      role_name : 'roles.role_name',
      role_index : 'roles.index',
      co_index : 'company.index ',
      dpart_index : 'dpartment.id',
      password : 'member.password',
      e164 : 'member.e164_num'

    }).from('member')
    .where({ 'member.id': username })
    .leftJoin('roles', 'member.role_index', 'roles.index')
    .leftJoin('company', 'member.co_index', 'company.index')
    .leftJoin('dpartment', function(builder){
      builder
      .on('company.index', '=', 'dpartment.company_index')
      .onNull('dpartment.parent_id')
    })
    .limit(1);
  }

  async findAll(){
    return this.knex.table('member');
  }

  async findAdminMemberList(callId : string, companyIndex : number, perPage : number, page : number){

    const query = this.knex.select('*', 'member.name as name', 'dpartment.name as dpart_name')
    .from('member')
    .where({
      'co_index' : companyIndex
    })
    .andWhere('member.id', "!=", callId)
    .leftJoin('roles', 'member.role_index', 'roles.index')
    .leftJoin('company', 'member.co_index', 'company.index')
    .leftJoin('dpartment', 'member.dpart_index', 'dpartment.id')
    const result = await KnexPagination.offsetPaginate({
      query: query,
      perPage: perPage,
      goToPage: page,
    });
    return result
  }

  async findSuperAdminMemberList(callId : string, perPage : number, page : number){

    const query = this.knex.select('*', 'member.name as name', 'dpartment.name as dpart_name')
    .from('member')
    .where('member.id', "!=", callId)
    .leftJoin('roles', 'member.role_index', 'roles.index')
    .leftJoin('company', 'member.co_index', 'company.index')
    .leftJoin('dpartment', 'member.dpart_index', 'dpartment.id')
    const result = await KnexPagination.offsetPaginate({
      query: query,
      perPage: perPage,
      goToPage: page,
    });
    return result
  }


  async insertMember(insertMemberDto : InsertMemberDto){

    return await this.knex('member').insert({
      id : insertMemberDto.id,
      name : insertMemberDto.name,
      password : await this.pwCryptoUtil.encrypt(insertMemberDto.password),
      role_index : insertMemberDto.roleIndex,
      co_index : insertMemberDto.coIndex,
      dpart_index : insertMemberDto.dpartIndex
    })
  }

  async checkMemberId(memberId : string){
    return await this.knex.select('*')
    .from('member')
    .where('id', '=' , memberId)
  }

  async generateE164(insertIdNumber){
    let genString = insertIdNumber.toString()

    const forLoopResult = 8 - genString.length;

    var step;
    for (step = 0; step < forLoopResult; step++) {
      genString = "0" + genString  
    }
    const generateNumber = "090" + genString;
    return generateNumber
  }

  async updateMemberE164( e164Num, insertIdNumber){
    await this.knex('member').update({
      'e164_num' : e164Num 
    }).where({
      'index' : insertIdNumber
    })
  }

}
