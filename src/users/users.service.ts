import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.knex.select('*').from('member')
    .where({ id: username })
    .leftJoin('roles', 'member.role_index', 'roles.index')
    .limit(1);
  }

  async findAll(){
    return this.knex.table('member');
  }

}
