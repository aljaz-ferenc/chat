import {Endpoints} from "../../Endpoints";
import type {Chat, User} from "../../types";

export async function fetchAddUsersToChat(chatId: Chat['_id'], usersIds: User['_id'][], addedBy: User['_id']){
    await fetch(Endpoints.chat(chatId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usersIds, addedBy})
    })
}