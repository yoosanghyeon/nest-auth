import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { async } from 'rxjs';


@Injectable()
export class ChattingService {
    constructor(@InjectKnex() private readonly knex: Knex){}

    async createChattingRoom(roomNm : String, roomPassword : String, chatRoomTyp : String, editor : String, memberNum : number, userRole : String){

        
            return await this.knex.transaction(async trx => {
                        
              const ids = await this.knex('chat_room')
                .insert({
                    chat_room_nm : roomNm,
                    chat_room_pwd : roomPassword,
                    chat_room_typ : chatRoomTyp,
                    editor : editor
                })
                .transacting(trx)

                await this.knex('chat_join_user')
                .insert({
                    chat_room_num : ids[0],
                    user_num : memberNum,
                    join_role : userRole
                })
                .transacting(trx)

                await this.knex('topics').insert({
                    topic_member_index : memberNum,
                    topic_name : `/chat/${ids[0]}`
                })
                .transacting(trx)
                trx.commit

                return ids[0];
            })
       
    }

    async userChatList(userIndex : number){

        var chatRoomNumColumnIdentifier = this.knex.ref('chat_room.chat_room_num');
        var msgUserNumColumnIdentifier = this.knex.ref('lastMsgUserIndex'); 

        var subQueryLastMsg = this.knex('chat_msg').select('snd_msg')
          .where({
            'chat_room_num' : chatRoomNumColumnIdentifier
          })
          .orderBy('msg_num', 'desc')
          .limit(1)
          .as('lastMsg');

          var subQueryMsgUserIndex = this.knex('chat_msg').select('snd_user_num')
          .where({
            'chat_room_num' : chatRoomNumColumnIdentifier
          })
          .orderBy('msg_num', 'desc')
          .limit(1)
          .as('lastMsgUserIndex');

          var subQueryMsgUserName = this.knex('member').select('name')
          .where({
            'index': msgUserNumColumnIdentifier,
          })
          .limit(1)
          .as('msgMemberName');


        return await this.knex.select(
            'chat_room.chat_room_num as chatRoomNum', 
            'chat_room.chat_room_nm as chatRoomNm',
            'chat_room.chat_room_pwd as chatRoomPwd',
            'chat_room.chat_room_typ as chatRoomTyp', 
            subQueryLastMsg,
            subQueryMsgUserIndex,
            subQueryMsgUserName
            )
        .from('chat_join_user')
        .leftJoin('chat_room', function() {
            this.on('chat_join_user.chat_room_num', '=', 'chat_room.chat_room_num')
        })
        .orderBy('chatRoomNum', 'desc')
        .where({
            user_num : userIndex
        });
    }

  async inviteChatRoom(chatRoomNum : number, memberNum : number, userRole : String){
    return await this.knex.transaction(async trx => {
           
        await this.knex('chat_join_user')
        .insert({
            chat_room_num : chatRoomNum,
            user_num : memberNum,
            join_role : userRole
        })
        .transacting(trx)

        await this.knex('topics').insert({
            topic_member_index : memberNum,
            topic_name : `/chat/${chatRoomNum}`
        })
        .transacting(trx)
        trx.commit

        return chatRoomNum;
    })
        
  }

}
