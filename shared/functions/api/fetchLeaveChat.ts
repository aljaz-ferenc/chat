import {Endpoints} from "../../Endpoints";
import type {Chat, User} from "../../types";

export async function fetchLeaveChat(chatId: Chat['_id'], userId: User['_id']){
    await fetch(Endpoints.leaveChat(chatId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId})
    })
}