import {Endpoints} from "../../Endpoints";
import type {Chat, User} from "../../types";

export async function fetchRenameChat(chatId: Chat['_id'], chatName: Chat['name'], userId: User['_id']){
    await fetch(Endpoints.chat(chatId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chatName, userId})
    })
}