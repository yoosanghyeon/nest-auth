import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { GpsInfoUpsertDto } from 'src/dto/GpsInfoUpsertDto';
import { attachOnDuplicateUpdate } from 'knex-on-duplicate-update';

@Injectable()
export class GpsService {
    constructor(@InjectKnex() private readonly knex: Knex) {
        attachOnDuplicateUpdate()
    }
    // innodb_autoinc_lock_mode : db에서 설정해야함 => 좀더 학습 해야함..
    async gpsInfoUpsert( userIndex : number, gpsData : GpsInfoUpsertDto ){

        return this.knex('gps_info')
        .insert({
            gps_user_index : userIndex,
            latitude : gpsData.latitude,
            longitude : gpsData.longitude,
            altitude : gpsData.altitude,
            reg_date : this.knex.fn.now()
        })
        .onConflict('gps_user_index')
        .merge();     
 
    }

}
